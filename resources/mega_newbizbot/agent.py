"""
Main agent file for the MegaNewBizBot.

This agent orchestrates entity extraction, lead qualification, and list generation
using a supervisor model.
"""

from typing import List, Dict, Any, Sequence, TypedDict, Annotated, Optional
from langgraph.graph import StateGraph, END
import operator
import asyncio
import json

# LangGraph Supervisor and LLM
from langgraph_supervisor import create_supervisor
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, AnyMessage, AIMessage
from langchain_core.runnables import RunnableLambda

# Assuming the state definition for the entity processing pipeline is in a sibling file/directory
from mega_newbizbot.state import MegaNewBizBotState

# --- Agent/Graph Imports (ASSUMPTIONS - Adjust imports as necessary) ---
from mega_newbizbot.entity_extraction_agent.graph import app as entity_extraction_app
from mega_newbizbot.lead_qualification_agent.graph import app as lead_qualification_app
# Ensure this path is correct and list_generation_app is a compiled LangGraph app
from mega_newbizbot.list_generation_agent.graph import app as list_generation_app


# --- Define the original entity processing workflow (current mega_agent_app logic) ---
# This workflow takes a list of entities and processes them.
CHUNK_SIZE_ORIGINAL = 20

async def extract_entities_original(state: MegaNewBizBotState) -> Dict[str, Any]:
    """Calls the entity extraction agent with a list of entities."""
    initial_context_list = state['initial_context'] # Expects a list here
    result = await entity_extraction_app.ainvoke({"initial_context": initial_context_list})
    all_entities = result.get('entities', [])
    return {"all_entities": all_entities, "processed_entities_count": 0, "qualified_leads": []}

def slice_entities_original(state: MegaNewBizBotState) -> Dict[str, Any]:
    """Slices the next chunk of entities to process."""
    all_entities = state['all_entities']
    processed_count = state.get('processed_entities_count', 0)
    start_index = processed_count
    end_index = min(start_index + CHUNK_SIZE_ORIGINAL, len(all_entities))
    current_chunk = all_entities[start_index:end_index]
    new_processed_count = end_index
    return {"current_chunk": current_chunk, "processed_entities_count": new_processed_count}

async def qualify_leads_chunk_original(state: MegaNewBizBotState) -> Dict[str, Any]:
    """Calls the lead qualification agent with the current chunk."""
    current_chunk = state['current_chunk']
    if not current_chunk:
        return {}
    result = await lead_qualification_app.ainvoke({"entities_to_qualify": current_chunk})
    qualification_result = result.get('qualified_leads', [])
    return {"qualified_leads": qualification_result} if qualification_result else {}

def should_continue_original(state: MegaNewBizBotState) -> str:
    """Determines whether to continue processing chunks or end."""
    processed_count = state.get('processed_entities_count', 0)
    all_entities = state.get('all_entities', [])
    total_entities = len(all_entities)
    if processed_count < total_entities:
        return "continue_slicing"
    else:
        return "end_process"

entity_processing_workflow = StateGraph(MegaNewBizBotState)
entity_processing_workflow.add_node("extract_entities_node", extract_entities_original)
entity_processing_workflow.add_node("slice_entities_node", slice_entities_original)
entity_processing_workflow.add_node("qualify_leads_node", qualify_leads_chunk_original)
entity_processing_workflow.set_entry_point("extract_entities_node")
entity_processing_workflow.add_edge("extract_entities_node", "slice_entities_node")
entity_processing_workflow.add_edge("slice_entities_node", "qualify_leads_node")
entity_processing_workflow.add_conditional_edges(
    "qualify_leads_node",
    should_continue_original,
    {
        "continue_slicing": "slice_entities_node",
        "end_process": END
    }
)
entity_processing_pipeline_app = entity_processing_workflow.compile(name="EntityProcessingSubGraph")
# --- End of original entity processing workflow definition ---


# --- Supervisor Setup ---

class SupervisorState(TypedDict):
    messages: Annotated[Sequence[AnyMessage], operator.add]
    # New fields to hold state from subgraphs
    all_entities: Optional[List[Dict[str, Any]]]
    qualified_leads: Optional[List[Dict[str, Any]]] # This will store the parsed dict from entity_processing_agent's final string output
    generated_list_urls: Optional[str] # Changed from List[str] to str
    last_completed_agent: Optional[str]
    remaining_steps: Optional[int] # Required by the underlying create_react_agent

llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash-001")

async def run_list_generation(state: SupervisorState) -> Dict[str, Any]:
    """
    Runs the list generation agent.
    The 'list_generation_agent' takes the user's query.
    Its output is an AI message where the content IS a string, 
    typically representing a list of URLs (e.g., a newline-separated string or a JSON string).
    """
    list_gen_result = await list_generation_app.ainvoke({"messages": state["messages"]})
    agent_messages = list_gen_result.get("messages", []) 
    
    final_string_content_from_agent: Optional[str] = None
    if agent_messages and isinstance(agent_messages[-1], AIMessage):
        content = agent_messages[-1].content # Expected to be a string
        if isinstance(content, str):
            final_string_content_from_agent = content
        else:
            # This case should ideally not happen if list_generation_agent's output is correctly a string.
            print(f"Warning: list_generation_agent output content was not a string as expected. Type: {type(content)}. Content: {content}")
            # Attempt a robust conversion to string.
            try:
                final_string_content_from_agent = json.dumps(content) if not isinstance(content, (str, bytes)) else str(content)
            except Exception as e:
                print(f"Error converting list_generation_agent output to string: {e}")
                final_string_content_from_agent = str(content) # Fallback
    else:
        if agent_messages:
            print(f"Warning: Last message from list_generation_agent was not an AIMessage or content was not as expected. Last message: {agent_messages[-1]}")
        else:
            print("Warning: list_generation_agent did not return any messages.")

    return {
        "messages": agent_messages, 
        "generated_list_urls": final_string_content_from_agent, # Store the string
        "last_completed_agent": "list_generation_agent"
    }

async def run_entity_processing(state: SupervisorState) -> Dict[str, Any]:
    """
    Runs the entity processing pipeline.
    It expects the supervisor to have called the handoff tool with an argument
    'message_content' containing a STRING. This string could be:
    1. A JSON string representing a list of URLs (e.g., '["http://example.com/list1"]')
    2. A JSON string representing a list of entities (e.g., '["Company A", "Company B"]')
    3. A string output from list_generation_agent (e.g., newline-separated URLs)

    This string is passed as 'initial_context' to the entity_processing_pipeline_app.
    The entity_extraction_agent within that pipeline is responsible for handling this string input.
    The final output of this function (for the supervisor) will be an AIMessage with a JSON string content.
    """
    message_payload_str: Optional[str] = None
    supervisor_tool_calls_info = "Not inspected or not found."
    expected_tool_name = f"transfer_to_{entity_processing_node.name}"

    if len(state["messages"]) >= 2:
        supervisor_ai_message = state["messages"][-2]
        if isinstance(supervisor_ai_message, AIMessage) and supervisor_ai_message.tool_calls:
            supervisor_tool_calls_info = str(supervisor_ai_message.tool_calls)
            for tool_call in supervisor_ai_message.tool_calls:
                if tool_call.get("name") == expected_tool_name:
                    if isinstance(tool_call.get("args"), dict):
                        raw_payload = tool_call["args"].get("message_content")
                        if isinstance(raw_payload, str):
                            message_payload_str = raw_payload
                        elif raw_payload is not None:
                            # This indicates supervisor might not have passed a string when it should have.
                            print(f"Warning: 'message_content' for {expected_tool_name} was not a string. Type: {type(raw_payload)}. Attempting conversion.")
                            try:
                                message_payload_str = json.dumps(raw_payload) # Best effort if it was a list/dict
                            except TypeError:
                                message_payload_str = str(raw_payload) # Fallback
                        if message_payload_str is not None:
                             break 
    
    if message_payload_str is None:
        error_message_content = (
            f"Error: `run_entity_processing` could not extract a string payload for 'message_content'. "
            f"Expected 'message_content' in arguments of tool call '{expected_tool_name}' from supervisor. "
            f"Supervisor's relevant AIMessage tool_calls: {supervisor_tool_calls_info}"
        )
        return {"messages": [AIMessage(content=error_message_content, name=entity_processing_node.name)]}

    # The 'initial_context' will be the string payload.
    # The entity_extraction_agent within entity_processing_pipeline_app must handle this string.
    pipeline_input = {"initial_context": message_payload_str}
    pipeline_result_state = await entity_processing_pipeline_app.ainvoke(pipeline_input)
    
    extracted_qualified_leads = pipeline_result_state.get("qualified_leads", [])
    extracted_all_entities = pipeline_result_state.get("all_entities", [])

    # The message content for the supervisor should be a JSON string.
    result_content_for_message = json.dumps({"qualified_leads": extracted_qualified_leads})
    
    agent_output_message = AIMessage(content=result_content_for_message, name=entity_processing_node.name)
    
    # Store the parsed qualified_leads in the supervisor state for potential direct access if needed,
    # though the primary data passage is via messages.
    parsed_qualified_leads_for_state = []
    try:
        # The qualified_leads from pipeline_result_state should already be a list of dicts.
        if isinstance(extracted_qualified_leads, list):
             parsed_qualified_leads_for_state = extracted_qualified_leads
        elif extracted_qualified_leads: # If not None/empty but not list (unexpected)
            print(f"Warning: 'qualified_leads' from entity_processing_pipeline was not a list: {type(extracted_qualified_leads)}")
    except Exception as e:
        print(f"Error processing qualified_leads for supervisor state: {e}")
        
    return {
        "messages": [agent_output_message],
        "qualified_leads": parsed_qualified_leads_for_state, # Store the parsed list here
        "all_entities": extracted_all_entities,
        "last_completed_agent": entity_processing_node.name
    }

supervisor_system_prompt = """You are a supervisor agent for a new business development bot.
Your primary goal is to determine the correct workflow based on the user's initial request and manage the data flow using STRING-BASED communication for message content and tool arguments.

The user's initial request (the first message content) will be one of three types:
1.  A general query requiring discovery (e.g., "Find tech companies in California"). This is a string.
2.  A direct list of URLs, provided as a JSON STRING (e.g., the literal string '["http://example.com/list1", "http://another.com/list2"]').
3.  A direct list of company/entity names, provided as a JSON STRING (e.g., the literal string '["Company A", "Company B"]').

Your routing logic for the initial request:
-   If the query is a general discovery request (Type 1):
    You MUST first delegate to the 'list_generation_agent'.
    The 'list_generation_agent' will take this query string. Its output will be an AI message where the content IS A STRING representing a list of URLs (e.g., a newline-separated string like "url1\\nurl2" or a JSON string like '["url1", "url2"]').
-   If the query is already a JSON string list of URLs (Type 2) OR a JSON string list of entities (Type 3):
    You MUST directly delegate to the 'entity_processing_agent'.
    The `message_content` argument in your tool call to 'entity_processing_agent' must be THIS EXACT JSON STRING from the user's input.

Follow-up logic after 'list_generation_agent' (if it was called for a Type 1 query):
-   The output string from 'list_generation_agent' (e.g., "url1\\nurl2" or '["url1", "url2"]') will be in the content of the last AI message.
-   You MUST then delegate to the 'entity_processing_agent', ensuring this output STRING is passed as the `message_content` argument in your tool call.

About 'entity_processing_agent':
-   This agent is a pipeline. The `message_content` argument in your tool call to it will ALWAYS be a STRING.
-   This input string could be:
    a) A JSON string list of URLs (from user input or potentially from list_generation_agent).
    b) A JSON string list of entity names (from user input).
    c) A newline-separated string of URLs (typically from list_generation_agent).
    d) A general discovery query string that somehow bypassed list_generation_agent (less common, but it should be prepared).
-   The first crucial step in this pipeline is an entity extraction sub-agent. This sub-agent is responsible for INTERPRETING THE INPUT STRING:
    -   If the input string is a list of URLs (JSON or newline-separated): It must parse these URLs, fetch content, and then extract entities.
    -   If the input string is a list of entity names (JSON): It must parse these entities and proceed with extraction/refinement.
    -   If it's a general query string, it should handle entity extraction from that.
-   The final output of the complete 'entity_processing_agent' pipeline will be an AI message where the content is a JSON STRING with the qualified leads (e.g., the string '{"qualified_leads": [{"name": "Lead1"}, ...]}'). This is the final result of the entire process.

Your responses MUST be tool calls to the appropriate agent ('list_generation_agent' or 'entity_processing_agent').
Do not respond with conversational messages, except for the final output from the 'entity_processing_agent' (which will be a JSON string).
When preparing data for the `message_content` argument of a tool call, ensure it is a STRING.
If the user's initial message is already a JSON string list, your thought process should reflect that you are directly passing this string.
The `qualified_leads` field in the final supervisor state will be populated by parsing the JSON string output from the `entity_processing_agent`.
"""

# Wrap the async functions into named RunnableLambdas
list_generation_node = RunnableLambda(run_list_generation, name="list_generation_agent")
entity_processing_node = RunnableLambda(run_entity_processing, name="entity_processing_agent")

agents_for_supervisor = [
    list_generation_node,
    entity_processing_node,
]

# Create the supervisor graph using create_supervisor
# It returns a StateGraph instance that then needs to be compiled.
supervisor_graph = create_supervisor(
    agents=agents_for_supervisor,
    model=llm,
    supervisor_name="MegaNewBizBotSupervisor",
    prompt=supervisor_system_prompt,
    state_schema=SupervisorState # Explicitly set the state schema
)

# Compile the supervisor graph to get the runnable application
mega_agent_app = supervisor_graph.compile()