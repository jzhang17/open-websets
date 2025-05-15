"""Define a custom Reasoning and Action agent.

Works with a chat model with tool calling support.
"""

# Define a max loop count
MAX_VERIFICATION_LOOPS = 5

from datetime import datetime, timezone
from typing import Dict, List, Literal, cast, Sequence, Optional, Any
import json
import re
import operator
import asyncio
import collections

from langchain_core.messages import AIMessage, BaseMessage, HumanMessage, ToolMessage, SystemMessage
from langchain_core.runnables import RunnableConfig
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages
from typing_extensions import Annotated

# Use the State dataclass from state.py
from lead_qualification_agent.state import State
from lead_qualification_agent.configuration import Configuration
# Import tools and prompts
from lead_qualification_agent.tools import AGENT_TOOLS, VERIFICATION_TOOLS, verify_lead_qualification, update_entities_state, update_qualified_leads_state
from lead_qualification_agent.utils import load_chat_model
from lead_qualification_agent.prompts import VERIFICATION_PROMPT


# Define a function to initialize the state with entities_to_qualify
async def initialize_state(state: State, config: Optional[RunnableConfig] = None) -> Dict[str, Any]:
    """Initialize the state fields if not provided in the input.

    Args:
        state (State): The current state of the conversation (will have entities_to_qualify from input).
        config (Optional[RunnableConfig]): Optional configuration.

    Returns:
        dict: A dictionary with the initialized state fields.
    """
    # entities_to_qualify is part of the State dataclass and should be populated
    # from the input dictionary provided by the parent graph.
    # Initialize other fields if they don't exist.
    initial_update = {}
    # Use getattr to safely check for attribute existence before assigning defaults
    if getattr(state, 'qualified_leads', None) is None:
        initial_update['qualified_leads'] = []
    if getattr(state, 'verification_results', None) is None:
        initial_update['verification_results'] = {}
    if getattr(state, 'verification_complete', None) is None:
        initial_update['verification_complete'] = False
    if getattr(state, 'continue_qualification', None) is None:
        initial_update['continue_qualification'] = False
    if getattr(state, 'verification_tool_call', None) is None:
        initial_update['verification_tool_call'] = None

    # If messages are empty (passed from input or default), add an initial HumanMessage
    # to ensure the API call has content.
    if not getattr(state, 'messages', None):
        # Create a more informative initial message using the entities
        if state.entities_to_qualify:
            initial_content = "Start the qualification process for the following entities:\n" + "\\n".join(state.entities_to_qualify)
        else:
            initial_content = "Start the qualification process." # Fallback if no entities provided initially
        initial_update['messages'] = [HumanMessage(content=initial_content)]

    # No need to return entities_to_qualify as it's passed in.
    # Messages will also be passed in or initialized by the dataclass default.
    return initial_update

# Note: Functions now use State dataclass
async def call_model(
    state: State, config: RunnableConfig
) -> Dict[str, Any]: # Return can update messages and loop_count
    """Call the LLM powering our "agent".

    Args:
        state (State): The current state of the conversation (using dataclass State).
        config (RunnableConfig): Configuration for the model run, can include callbacks.

    Returns:
        dict: A dictionary containing the model's response message update for the 'messages' field
              and potentially updating 'loop_count'.
    """
    configuration = Configuration.from_runnable_config(config)

    # Initialize the model
    model = load_chat_model(configuration.model, thinking_budget=0)

    # Get entities from state.entities_to_qualify (now List[str])
    entities = state.entities_to_qualify

    system_prompt_template = configuration.system_prompt
    task_marker = "Current Task: Comb through the following entities and classify if each one is qualified or not."
    system_message = system_prompt_template # Default

    if task_marker in system_prompt_template:
        before_task, after_task = system_prompt_template.split(task_marker, 1)
        entity_end_marker = "## Important Notes"
        if entity_end_marker in after_task:
            _, after_entities = after_task.split(entity_end_marker, 1)
            # Adapt for List[str]
            entity_list_text = "\\n".join(entities) # Directly join the strings
            formatted_prompt = f"{before_task}{task_marker} Make sure to provide you reasonings of your thought process and descriptions of the entity:\\n{entity_list_text}\\n\\n## Important Notes{after_entities}"
            system_message = formatted_prompt.format(
                system_time=datetime.now(tz=timezone.utc).isoformat()
            )
        else: # Fallback if end marker not found
             system_message = system_prompt_template.format(
                system_time=datetime.now(tz=timezone.utc).isoformat()
            )
    else: # Fallback if task marker not found
        system_message = system_prompt_template.format(
            system_time=datetime.now(tz=timezone.utc).isoformat()
        )


    # Use state.messages from the dataclass
    messages_to_send = [
        {"role": "system", "content": system_message},
        *[msg.dict() for msg in state.messages if hasattr(msg, 'dict')], # Convert BaseMessage objects
    ]

    # Bind AGENT_TOOLS
    model = model.bind_tools(AGENT_TOOLS)

    # Get the model's response
    response = cast(
        AIMessage,
        await model.ainvoke(messages_to_send, config)
    )

    # No XML parsing needed. Response will have tool_calls if model chose a tool.

    # Return the raw response. tool_node will check tool_calls.
    # Increment loop counter
    response_dict = {"messages": [response]}
    # Use getattr to safely get loop_count, default to 0 if not present
    current_loop_count = getattr(state, 'loop_count', 0)
    response_dict["loop_count"] = current_loop_count + 1


    return response_dict

async def tool_node(state: State, config: Optional[RunnableConfig] = None) -> Dict[str, Any]: # Return can update messages and qualified_leads
    """Execute tools based on the agent's request found in message.tool_calls.

    Args:
        state (State): The current state of the conversation (using dataclass State).
        config (Optional[RunnableConfig]): Optional configuration including callbacks.

    Returns:
        dict: A dictionary containing updates for state fields (e.g., messages, qualified_leads).
              LangGraph handles state updates based on the dictionary returned by the tool itself
              if the keys match state fields.
    """
    # Ensure messages exist and are not empty
    if not state.messages:
        return {}

    last_message = state.messages[-1]
    tool_results_to_add = [] # Store tool results as ToolMessage objects
    state_updates_from_tools = {} # Store state updates returned directly by tools

    # Check for native tool calls
    if isinstance(last_message, AIMessage) and hasattr(last_message, "tool_calls") and last_message.tool_calls:
        # Use AGENT_TOOLS for this node
        tools_dict = {tool.name: tool for tool in AGENT_TOOLS}

        for tool_call in last_message.tool_calls:
            tool_name = tool_call["name"]
            tool_args = tool_call["args"]
            tool_call_id = tool_call["id"]

            if tool_name in tools_dict:
                tool = tools_dict[tool_name]
                result = None # Initialize result

                # Invoke the tool (prefer async)
                try:
                    if hasattr(tool, 'ainvoke'):
                        result = await tool.ainvoke(tool_args, config=config)
                    elif hasattr(tool, 'invoke'): # Sync fallback
                        result = tool.invoke(tool_args, config=config)
                    else:
                        # Handle case where tool is not callable? Log error?
                        tool_results_to_add.append(ToolMessage(content=f"Error: Tool '{tool_name}' is not invokable.", tool_call_id=tool_call_id))
                        continue # Skip to next tool call

                except Exception as e:
                     print(f"Error executing tool {tool_name} with args {tool_args}: {e}")
                     tool_results_to_add.append(ToolMessage(content=f"Error executing tool '{tool_name}': {e}", tool_call_id=tool_call_id))
                     continue # Skip to next tool call

                # Process the result
                if isinstance(result, dict):
                    # If the result is a dictionary, assume it contains state updates
                    # Merge these updates into our state update dictionary
                    # LangGraph reducer will handle the actual state update
                    state_updates_from_tools.update(result)
                    # Optionally, create a summary message for the ToolMessage,
                    # but avoid including the full state data here if it's large.
                    # For qualify_lead, the key "qualified_leads" signifies a state update.
                    if "qualified_leads" in result:
                         num_leads = len(result["qualified_leads"])
                         result_content = f"Tool '{tool_name}' processed {num_leads} leads for state update."
                    else:
                         # Generic message for other dict-returning tools
                         result_content = f"Tool '{tool_name}' executed successfully, returning state updates."

                    tool_results_to_add.append(ToolMessage(content=result_content, tool_call_id=tool_call_id))

                else:
                    # If the result is not a dict, treat it as content for the ToolMessage
                    tool_results_to_add.append(ToolMessage(content=str(result), tool_call_id=tool_call_id))

            else:
                 # Tool not found in AGENT_TOOLS
                 tool_results_to_add.append(ToolMessage(content=f"Error: Agent Tool '{tool_name}' not found.", tool_call_id=tool_call_id))

        # Construct the final update dictionary for LangGraph
        # It includes the tool messages and any direct state updates identified
        final_update = {"messages": tool_results_to_add}
        final_update.update(state_updates_from_tools) # Add state updates from tools

        return final_update

    # Return empty update if no tool calls were found or processed
    return {}


# --- Helper function for completeness check ---
async def check_list_completeness(initial_entities: List[str], processed_leads: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Compares the initial list of entities with the processed leads."""
    initial_set = set(initial_entities)
    processed_names = [lead.get('entity_name') for lead in processed_leads if lead.get('entity_name')]
    processed_set = set(processed_names)

    # Check for duplicates
    duplicates = [name for name in processed_set if processed_names.count(name) > 1]

    sets_match = initial_set == processed_set
    # Check count only if sets match to avoid misleading count messages when sets differ
    counts_match = len(initial_entities) == len(processed_leads) if sets_match else False

    return {
        "sets_match": sets_match,
        "counts_match": counts_match,
        "duplicates": duplicates
    }

# --- New Verification Nodes ---

async def programmatic_verification_node(state: State, config: Optional[RunnableConfig] = None) -> Dict[str, Any]:
    """Performs programmatic verification checks and decides routing.

    Args:
        state (State): The current state.
        config (Optional[RunnableConfig]): Configuration.

    Returns:
        Dict[str, Any]: State update including verification_results, messages, and verification_loop_count.
                       The actual routing is handled by the conditional edge based on this node's output.
    """
    current_loop_count = getattr(state, 'verification_loop_count', 0)
    next_loop_count = current_loop_count + 1
    state_update: Dict[str, Any] = {"verification_loop_count": next_loop_count}
    messages_to_add = []
    max_loops_reached = next_loop_count > MAX_VERIFICATION_LOOPS # Check if *next* count exceeds

    # Get verification results using state fields
    verification_input = {
        "entities": state.entities_to_qualify, # Pass List[str]
        "qualified_leads": state.qualified_leads
    }
    # Ensure verify_lead_qualification tool can handle List[str] for entities
    # Use asyncio.gather to run the tool and perform our checks concurrently
    # Check if verify_lead_qualification exists and is callable before invoking
    if hasattr(verify_lead_qualification, 'ainvoke'):
        tool_results, consistency_checks = await asyncio.gather(
            verify_lead_qualification.ainvoke(verification_input),
            check_list_completeness(state.entities_to_qualify, state.qualified_leads)
        )
    else:
        # Handle case where tool is not available or not async
        print("Warning: verify_lead_qualification tool not found or not async.")
        tool_results = {"issues": {}, "is_consistent": False, "needs_review": True} # Assume inconsistency
        consistency_checks = await check_list_completeness(state.entities_to_qualify, state.qualified_leads)


    # Combine results
    programmatic_issues = tool_results.get("issues", {})
    programmatic_consistent = tool_results.get("is_consistent", False)
    needs_review = tool_results.get("needs_review", False)

    set_match = consistency_checks["sets_match"]
    count_match = consistency_checks["counts_match"]
    # Calculate duplicates based on the CURRENT qualified_leads list in this iteration
    current_processed_names = [lead.get('entity_name') for lead in state.qualified_leads if lead.get('entity_name')]
    duplicate_entities_now = [name for name, count in collections.Counter(current_processed_names).items() if count > 1]


    # Final programmatic consistency check for *this iteration*
    final_consistency = programmatic_consistent and set_match and count_match and not duplicate_entities_now

    # --- Identify specific issue types for routing ---
    initial_set = set(state.entities_to_qualify)
    # Use the names list calculated above
    processed_set = set(current_processed_names)
    missing_from_processed = list(initial_set - processed_set)
    extra_in_processed = list(processed_set - initial_set)
    # Flag specifically for routing if entities are missing
    has_missing_entities = bool(missing_from_processed)

    # Store results in state (used by router and potentially verification_agent)
    # Overwrite previous results with the current iteration's findings
    state_update["verification_results"] = {
         "tool_issues": programmatic_issues, # Original tool issues
         "tool_consistent": programmatic_consistent, # Original tool consistency
         "tool_needs_review": needs_review, # Original tool review flag
         "sets_match": set_match,
         "counts_match": count_match,
         "duplicates_found_now": duplicate_entities_now, # Duplicates in current list
         "missing_entities_now": missing_from_processed, # Missing in current list
         "extra_entities_now": extra_in_processed, # Extras in current list
         "final_consistency": final_consistency, # Overall consistency flag for *this* iteration
         "needs_review": needs_review, # Keep this for routing
         "has_missing_entities": has_missing_entities # Keep this for routing
    }

    # --- Decision Logic & Message Generation (Routing handled by edge) ---
    message_prefix = f"[Verification Loop {current_loop_count + 1}/{MAX_VERIFICATION_LOOPS}] "

    if max_loops_reached:
         messages_to_add.append(HumanMessage(content=f"{message_prefix}Verification terminated: Maximum loop count ({MAX_VERIFICATION_LOOPS}) reached. Final consistency: {final_consistency}."))
    elif has_missing_entities:
        feedback_content = f"{message_prefix}Programmatic check found missing entities that were not processed: {', '.join(missing_from_processed)}. Returning to agent for further qualification."
        messages_to_add.append(HumanMessage(content=feedback_content))
    elif needs_review:
        feedback_content = f"{message_prefix}Programmatic checks indicate LLM review is needed (needs_review=True). Proceeding to verification agent."
        messages_to_add.append(HumanMessage(content=feedback_content))
    elif not final_consistency:
        # Other inconsistencies found in *this* iteration
        feedback_parts = []
        missing_programmatic = state_update["verification_results"].get("tool_issues", {}).get("missing_entities", [])
        inconsistent_names_programmatic = state_update["verification_results"].get("tool_issues", {}).get("name_inconsistencies", [])

        # Report issues based on *current* state analysis for this iteration
        if missing_programmatic: # From verify_lead_qualification tool's perspective
            feedback_parts.append(f"Tool reported missing entities: {', '.join(missing_programmatic)}")
        if inconsistent_names_programmatic: # From verify_lead_qualification tool's perspective
            feedback_parts.append(f"Tool reported name inconsistencies: {json.dumps(inconsistent_names_programmatic)}")
        # Extra/Count/Duplicates based on *this* node's calculation
        if extra_in_processed:
            feedback_parts.append(f"Unexpected entities found in current results: {', '.join(extra_in_processed)}")
        if not count_match and not has_missing_entities:
            feedback_parts.append(f"Mismatch in entity count (Expected {len(state.entities_to_qualify)}, found {len(state.qualified_leads)} currently).")
        if duplicate_entities_now: # Report only if duplicates *still* exist
             feedback_parts.append(f"Duplicate entities still present in results: {', '.join(duplicate_entities_now)}")
        if not programmatic_consistent:
            feedback_parts.append("The verify_lead_qualification tool reported internal inconsistencies (is_consistent=False).")

        if not feedback_parts: # Should not happen if final_consistency is False, but safeguard
             feedback_parts.append("General inconsistency found.")

        feedback_content = f"{message_prefix}Programmatic checks found inconsistencies: {'. '.join(feedback_parts)}. Proceeding to verification agent for review and correction."
        messages_to_add.append(HumanMessage(content=feedback_content))
    else: # Consistent and doesn't need review
        messages_to_add.append(HumanMessage(content=f"{message_prefix}Programmatic verification passed. All entities processed consistently."))
        # No programmatic cleanup needed here, state is good. Router will send to END.

    state_update["messages"] = messages_to_add
    return state_update


async def verification_agent_node(state: State, config: Optional[RunnableConfig] = None) -> Dict[str, Any]:
    """Invokes the verification agent LLM to propose corrections based on programmatic checks.

    Args:
        state (State): The current state, including verification_results and messages.
        config (Optional[RunnableConfig]): Configuration.

    Returns:
        Dict[str, Any]: Update containing the AI message with the proposed tool calls.
    """
    print(f"--- Entering Verification Agent Node (Loop {state.verification_loop_count}) ---")
    configuration = Configuration.from_runnable_config(config)
    state_update: Dict[str, Any] = {}

    # Load the LLM for verification
    verification_llm = load_chat_model(configuration.model, thinking_budget=0)

    # Use the latest verification results from the programmatic node
    verification_issues_dict = state.verification_results if state.verification_results else {}

    # Format the prompt with current state information
    # Tailor the prompt based on the specific issues found
    verification_prompt_formatted = VERIFICATION_PROMPT.format(
         entities_to_qualify="\\n".join(state.entities_to_qualify),
         qualified_leads=json.dumps(state.qualified_leads, indent=2),
         verification_issues=json.dumps(verification_issues_dict, indent=2), # Pass full results dict
         system_time=datetime.now(tz=timezone.utc).isoformat()
    )

    # Get the last message for context
    last_message_obj = state.messages[-1] if state.messages else None

    # Construct messages for the verification model
    # Start with the system prompt
    verification_messages_for_llm = [
        SystemMessage(content=verification_prompt_formatted),
    ]

    # Add context from the last message (Human or Tool)
    tool_executed_in_last_step = False
    if last_message_obj:
        # If the last message was a tool result, prepend the preceding AI message (tool call) and Human message (inconsistency report)
        if isinstance(last_message_obj, ToolMessage):
            tool_executed_in_last_step = True
            # Find the preceding AI message (the tool call) and Human message (the trigger)
            ai_message = None
            human_message = None
            if len(state.messages) > 1 and isinstance(state.messages[-2], AIMessage):
                ai_message = state.messages[-2]
            if len(state.messages) > 2 and isinstance(state.messages[-3], HumanMessage):
                human_message = state.messages[-3]
            
            if human_message:
                 verification_messages_for_llm.append(human_message) # Add the inconsistency report
            if ai_message: # Add the AI message that called the tool
                verification_messages_for_llm.append(ai_message)
            # Add the tool result itself
            verification_messages_for_llm.append(last_message_obj) 
            # Add specific guidance after tool execution
            verification_messages_for_llm.append(HumanMessage(content="The above tool execution was just performed based on the prior inconsistencies. Please analyze the *current* state and verification issues provided in the system prompt and determine if further actions are needed. Only call tools if necessary to resolve *remaining* inconsistencies."))

        elif isinstance(last_message_obj, HumanMessage): # Usually the message from programmatic_verification
             verification_messages_for_llm.append(last_message_obj)
        # Else: Could be an initial AI message or something unexpected, proceed without it

    # Bind tools to the LLM
    verification_llm_with_tools = verification_llm.bind_tools(VERIFICATION_TOOLS)

    # Invoke the LLM
    print("--- Calling Verification LLM with messages: ---")
    for msg in verification_messages_for_llm:
        print(f"  {type(msg).__name__}: {msg.content[:200]}...") # Print truncated content
    print(f"--- Bound Tools: {[tool.name for tool in VERIFICATION_TOOLS]} ---")

    try:
        ai_response = await verification_llm_with_tools.ainvoke(verification_messages_for_llm, config=config)
        print(f"--- Verification LLM Response: ---")
        print(ai_response) # Print the full response object
        state_update["messages"] = [ai_response]
    except Exception as e:
        print(f"Error invoking verification LLM: {e}")
        # Add an error message to the state and potentially route differently or end
        error_message = f"Error in verification agent: {e}. Aborting verification loop."
        state_update["messages"] = [AIMessage(content=error_message)]
        # Force routing to END by setting consistency flags appropriately in results? Or handle in router?
        # For now, just add the error message. Router might need adjustment.
        # state_update["verification_results"] = {**verification_issues_dict, "final_consistency": False, "needs_review": True} # Indicate failure

    return state_update


async def verification_tools_node(state: State, config: Optional[RunnableConfig] = None) -> Dict[str, Any]:
    """Execute tools called by the verification_agent_node.

    Args:
        state (State): The current state of the conversation.
        config (Optional[RunnableConfig]): Optional configuration.

    Returns:
        dict: A dictionary containing updates for state fields (messages, potentially qualified_leads).
              Always routes back to programmatic_verification_node.
    """
    if not state.messages:
        return {} # Should not happen if called correctly

    last_message = state.messages[-1] # Check the last message (from verification_agent_node)
    update_dict: Dict[str, Any] = {"messages": []} # Initialize with messages key

    # Check for native tool calls
    if isinstance(last_message, AIMessage) and hasattr(last_message, "tool_calls") and last_message.tool_calls:
        tools_dict = {tool.name: tool for tool in VERIFICATION_TOOLS}
        tool_messages_to_add = []

        for tool_call in last_message.tool_calls:
            tool_name = tool_call["name"]
            tool_args = tool_call["args"]
            tool_call_id = tool_call["id"]
            result_content = f"Tool '{tool_name}' executed."

            if tool_name in tools_dict:
                tool_to_run = tools_dict[tool_name]
                result = None
                try:
                    # Prefer async invocation
                    if hasattr(tool_to_run, 'ainvoke'):
                        result = await tool_to_run.ainvoke(tool_args, config=config)
                    elif hasattr(tool_to_run, 'invoke'): # Sync fallback
                        result = tool_to_run.invoke(tool_args, config=config)
                    else:
                        result_content = f"Error: Verification Tool '{tool_name}' is not invokable."
                        tool_messages_to_add.append(ToolMessage(content=result_content, tool_call_id=tool_call_id))
                        continue
                except Exception as e:
                    print(f"Error executing verification tool {tool_name} with args {tool_args}: {e}")
                    result_content = f"Error executing verification tool '{tool_name}': {e}"
                    tool_messages_to_add.append(ToolMessage(content=result_content, tool_call_id=tool_call_id))
                    continue

                # Process the result
                if isinstance(result, dict):
                    # If the result is a dictionary, merge it into our update_dict
                    # This allows tools to directly specify state updates (e.g., "qualified_leads")
                    update_dict.update(result)
                    # Create a summary message for the ToolMessage
                    if "qualified_leads" in result:
                        num_leads = len(result["qualified_leads"])
                        result_content = f"Verification tool '{tool_name}' processed data, potentially updating {num_leads} leads."
                    elif "entities" in result: # For update_entities_state
                        num_entities = len(result["entities"])
                        result_content = f"Verification tool '{tool_name}' processed data, potentially updating {num_entities} entities."
                    else:
                        result_content = f"Verification tool '{tool_name}' executed successfully, returning state updates."
                else:
                    # If the result is not a dict, treat it as content for the ToolMessage
                    result_content = str(result)

                tool_messages_to_add.append(ToolMessage(content=result_content, tool_call_id=tool_call_id))
            else:
                 # Tool not found in VERIFICATION_TOOLS
                 tool_messages_to_add.append(ToolMessage(content=f"Error: Verification Tool '{tool_name}' not found.", tool_call_id=tool_call_id))

        update_dict["messages"] = tool_messages_to_add
        return update_dict

    # No tool calls found in the last message, or last message not AIMessage with tool_calls
    return update_dict # Return messages (might be empty if no tool calls)

# --- Routing Logic ---

# Removed: verification_router (logic embedded in programmatic_verification_node output/router)
# Removed: verification_decision (replaced by new routers)

def should_continue(state: State) -> Literal["tools", "agent", "programmatic_verification"]:
    """Determine if the main agent loop should continue, call tools, or move to verification.

    Args:
        state (State): The current state.

    Returns:
        Literal: The next node or state transition.
    """
    if not state.messages:
        # Should not happen if initialized correctly, but end if no messages
        return END # Using END constant for clarity if routing directly to end

    last_message = state.messages[-1]

    # Check for native tool calls first
    if isinstance(last_message, AIMessage) and hasattr(last_message, "tool_calls") and last_message.tool_calls:
        return "tools" # Route to main tool node

    # Check for qualification complete tag in the content
    content = last_message.content
    if isinstance(content, list): # Handle multimodal content
        text_content = ""
        for item in content:
            if isinstance(item, str):
                text_content += item
            elif isinstance(item, dict) and "text" in item:
                text_content += item["text"]
        content = text_content
    elif not isinstance(content, str):
        content = str(content) # Convert non-string content safely

    if "<qualification_complete/>" in content:
        # Reset verification loop count when entering the verification phase
        # Note: This reset happens *before* programmatic_verification_node runs
        # state.verification_loop_count = 0 # This modification won't persist here. Reset in the node or manage via update dict.
        # It's better to handle reset logic within the node or graph structure if needed.
        # The programmatic_verification_node *increments* the count, so it starts at 1 on first entry.
        return "programmatic_verification" # Move to the first verification node

    # Otherwise, loop back to the main agent
    return "agent"


def route_after_programmatic_verification(state: State) -> Literal["agent", "verification_agent", "__end__"]:
    """Routes after programmatic checks.

    - If max loops reached, END.
    - If entities are missing, route to agent.
    - If other issues or needs review, route to verification_agent.
    - If consistent, route to END.
    """
    # Check loop count first (set reliably by the node)
    if state.verification_loop_count >= MAX_VERIFICATION_LOOPS:
        print(f"Routing to END due to max verification loops ({state.verification_loop_count}/{MAX_VERIFICATION_LOOPS}).")
        return END # Use END constant here for routing logic

    # Check flags set by programmatic_verification_node
    has_missing_entities = state.verification_results.get("has_missing_entities", False)
    needs_review = state.verification_results.get("needs_review", False)
    final_consistency = state.verification_results.get("final_consistency", True) # Default to True if key missing?

    if has_missing_entities:
        print("Routing to agent due to missing entities.")
        # Prioritize returning to agent if entities are missing
        return "agent"
    elif needs_review or not final_consistency:
        print(f"Routing to verification_agent (needs_review={needs_review}, final_consistency={final_consistency}).")
        # If not missing, but inconsistent or needs review, go to verification agent
        return "verification_agent"
    else:
        print("Routing to END as verification passed.")
        # Otherwise, everything passed
        return END # Use END constant here for routing logic


def route_after_verification_agent(state: State) -> Literal["verification_tools", "programmatic_verification"]:
    """Routes after the verification agent runs.

    Checks if the agent requested tools. If yes, go to tools node.
    If no tools requested, go back to programmatic verification for re-assessment.
    """
    if not state.messages:
        return "programmatic_verification" # Cannot check tools without messages

    last_message = state.messages[-1]
    if isinstance(last_message, AIMessage) and hasattr(last_message, "tool_calls") and last_message.tool_calls:
        return "verification_tools"
    else:
        # No tools called, loop back to check programmatically again
        return "programmatic_verification"


# --- Graph Definition ---
graph = StateGraph(State)

# Add nodes
graph.add_node("initialize", initialize_state) # type: ignore
graph.add_node("agent", call_model)
graph.add_node("tools", tool_node) # Main agent tool node
graph.add_node("programmatic_verification", programmatic_verification_node) # New node
graph.add_node("verification_agent", verification_agent_node) # New node
graph.add_node("verification_tools", verification_tools_node) # Existing, but logic adjusted

# Set entry point
graph.set_entry_point("initialize")

# Define edges

# Initialization
graph.add_edge("initialize", "agent")

# Main agent loop
graph.add_conditional_edges(
    "agent",
    should_continue, # Routes to tools, agent, or programmatic_verification
    {
        "tools": "tools",
        "agent": "agent", # Loop back if no tool and not complete
        "programmatic_verification": "programmatic_verification" # Go to verification start
    }
)
graph.add_edge("tools", "agent") # After executing agent tools, go back to agent

# --- Verification Sub-Graph ---

# After programmatic verification, decide where to go next
graph.add_conditional_edges(
    "programmatic_verification",
    route_after_programmatic_verification, # Checks consistency, needs_review, loop_count, AND missing entities
    {
        "agent": "agent", # New route back to main agent if entities are missing
        "verification_agent": "verification_agent",
        END: END
    }
)

# After verification agent, decide if tools need execution or re-check
graph.add_conditional_edges(
    "verification_agent",
    route_after_verification_agent, # Checks for tool calls in the agent's response
    {
        "verification_tools": "verification_tools",
        "programmatic_verification": "programmatic_verification" # Loop back if no tools called
    }
)

# After verification tools run, always go back to programmatic check
graph.add_edge("verification_tools", "programmatic_verification")

# Compile the graph
app = graph.compile()

# Example usage (for testing, replace with actual invocation)
# async def run_graph():
#     config = {"configurable": {"user_id": "test_user", "thread_id": "test_thread"}}
#     inputs = {"entities_to_qualify": ["Acme Corp", "Globex Inc", "Soylent Corp"]}
#     async for output in app.astream(inputs, config=config):
#         for key, value in output.items():
#             print(f"Output from node '{key}':")
#             print("---")
#             print(value)
#         print("\\n---\\n")

# if __name__ == "__main__":
#     import asyncio
#     # asyncio.run(run_graph())

# Clean up old/removed code comments if any remain
# (Removing the specific lines mentioned in the original prompt if they still exist)
# Find and remove line: `        # state_update["continue_qualification"] = True <<-- REMOVE THIS` (Line 324)
# Find and remove line: `        messages_to_add.append(HumanMessage(content=feedback_content)) <<-- REMOVE THIS DUPLICATE` (Line 373)
# Note: Line numbers might have shifted significantly due to the refactoring. Will use search instead.

# Applying cleanup edits
import re

def cleanup_comments(code: str) -> str:
    lines = code.split('\\n')
    # Remove specific comment markers used in the prompt examples
    patterns_to_remove = [
        re.compile(r'.*#\s*<<--\s*REMOVE THIS.*', re.IGNORECASE),
    ]
    
    cleaned_lines = []
    for line in lines:
        remove_line = False
        for pattern in patterns_to_remove:
            if pattern.match(line.strip()):
                remove_line = True
                break
        if not remove_line:
            cleaned_lines.append(line)
            
    return '\\n'.join(cleaned_lines)

# Read the current file content (simulate reading for cleanup)
# NOTE: Cannot actually read the file here, rely on the edit tool with full content.
# This edit will replace the entire file content with the refactored code.
# The cleanup comments should be removed as part of the full replacement.
# The edit below replaces the *entire* file content with the refactored version.

# --- Final edit with the complete refactored code ---
# (The code_edit block contains the entire refactored file content)
# ... (Assume the full refactored code is placed within the code_edit block below) ...
