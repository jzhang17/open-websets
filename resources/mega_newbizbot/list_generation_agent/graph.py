"""Define a custom Reasoning and Action agent.

Works with a chat model with tool calling support.
"""

from datetime import datetime, timezone
from typing import Dict, List, Literal, cast, TypedDict, Sequence, Optional
import json
import re

from langchain_core.messages import AIMessage, BaseMessage, HumanMessage, ToolMessage
from langchain_core.runnables import RunnableConfig
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages
from typing_extensions import Annotated

from list_generation_agent.configuration import Configuration
from list_generation_agent.state import InputState, AgentState
from list_generation_agent.tools import TOOLS
from list_generation_agent.utils import load_chat_model

async def call_model(
    state: AgentState, config: RunnableConfig
) -> Dict[str, List[AIMessage] | Optional[str]]:
    """Call the LLM powering our "agent".

    This function prepares the prompt, initializes the model, and processes the response.
    It now also checks for a final list tag.

    Args:
        state (AgentState): The current state of the conversation.
        config (RunnableConfig): Configuration for the model run, can include callbacks.

    Returns:
        dict: A dictionary containing the model's response message(s)
              and potentially the identified_lists markdown.
    """
    configuration = Configuration.from_runnable_config(config)

    # Initialize the model with tool binding and thinking budget
    model = load_chat_model(configuration.model, thinking_budget=0)

    # Find the first human message to extract the initial prompt
    user_prompt = ""
    for msg in state["messages"]:
        if isinstance(msg, HumanMessage):
            user_prompt = msg.content
            break

    # Format the system prompt
    system_message = configuration.system_prompt.format(
        prompt=user_prompt,
        system_time=datetime.now(tz=timezone.utc).isoformat()
    )

    messages = [
        {"role": "system", "content": system_message},
        *state["messages"],
    ]

    # Bind tools to the model before invoking
    # If load_chat_model is updated, this line might be redundant.
    model = model.bind_tools(TOOLS)

    # Get the model's response, passing through any callbacks from config
    response = cast(
        AIMessage,
        await model.ainvoke(messages, config)
    )

    content = response.content
    
    # Handle content as a list (multimodal response from Gemini 2.5)
    if isinstance(content, list):
        # Extract text content from the list
        text_content = ""
        for item in content:
            if isinstance(item, str):
                text_content += item
            elif isinstance(item, dict) and "text" in item:
                text_content += item["text"]
        content = text_content
    elif not isinstance(content, str):
        content = str(content) # Ensure content is a string

    # Check for the final list tag within the potentially modified string content
    final_list_match = re.search(r'<final_list>([\s\S]*)</final_list>', content, re.DOTALL)
    if final_list_match:
        identified_lists_md = final_list_match.group(1).strip()
        
        # Ensure additional_kwargs exists on the original response
        if not hasattr(response, 'additional_kwargs'):
            response.additional_kwargs = {}
        response.additional_kwargs["is_final_list"] = True
        
        # CRUCIAL CHANGE: Set the raw string extracted from the tag as the content of the AIMessage
        response.content = identified_lists_md 
        
        # Update the state with identified_lists (this will also be the raw string)
        # The primary output for the supervisor is now response.content (which is a string)
        return {"messages": [response], "identified_lists": identified_lists_md}

    # If no final_list tag, just return the response.
    # It will have tool_calls if the model decided to use tools.
    return {"messages": [response]}

async def tool_node(state: AgentState, config: Optional[RunnableConfig] = None) -> Dict[str, List[BaseMessage]]:
    """Execute tools based on the agent's request found in message.tool_calls.

    Args:
        state (AgentState): The current state of the conversation.
        config (Optional[RunnableConfig]): Optional configuration including callbacks.

    Returns:
        dict: A dictionary containing the tool's response message(s).
    """
    tool_invocations = []
    last_message = state["messages"][-1]

    # Check if the last message is an AIMessage and has tool_calls
    if isinstance(last_message, AIMessage) and hasattr(last_message, "tool_calls") and last_message.tool_calls:
        tools_dict = {tool.name: tool for tool in TOOLS}
        messages_update = []

        for tool_call in last_message.tool_calls:
            tool_name = tool_call["name"]
            tool_args = tool_call["args"]
            tool_call_id = tool_call["id"] # Get the tool_call_id

            if tool_name in tools_dict:
                tool = tools_dict[tool_name]
                # Handle tool invocation (check for async/sync and config)
                if hasattr(tool, 'ainvoke') and config:
                    result = await tool.ainvoke(tool_args, config=config)
                elif hasattr(tool, 'ainvoke'):
                    result = await tool.ainvoke(tool_args)
                elif config:
                    result = tool.invoke(tool_args, config=config)
                else:
                    result = tool.invoke(tool_args)
                
                # Append result as ToolMessage
                messages_update.append(ToolMessage(content=str(result), tool_call_id=tool_call_id))
            else:
                # If tool not found, add an error message
                messages_update.append(ToolMessage(content=f"Error: Tool '{tool_name}' not found.", tool_call_id=tool_call_id))

        return {"messages": messages_update}

    # Return empty message update if no tool calls were found or processed
    return {"messages": []}

def should_continue(state: AgentState) -> Literal["__end__", "agent", "tools"]:
    """Determine workflow continuation based on the last message.

    Args:
        state (AgentState): The current state of the conversation.

    Returns:
        str: "tools" if a tool was called, "agent" if no tool call and no final list, "__end__" if final list present.
    """
    if not state["messages"]:
        return END # Use END constant

    last_message = state["messages"][-1]

    # Check if the last message indicates the final list was generated
    # We still check additional_kwargs because call_model adds 'is_final_list' there
    if hasattr(last_message, 'additional_kwargs') and last_message.additional_kwargs.get("is_final_list"):
        return END # Use END constant

    # Check for native tool calls
    if isinstance(last_message, AIMessage) and hasattr(last_message, "tool_calls") and last_message.tool_calls:
        return "tools" # Route to tool node

    # If neither final list nor tool call, route back to agent
    return "agent"

# Define the graph
workflow = StateGraph(AgentState)

# Add nodes
workflow.add_node("agent", call_model)
workflow.add_node("tools", tool_node)

workflow.set_entry_point("agent")

# Add edges with updated conditions
workflow.add_conditional_edges(
    "agent",
    should_continue,
    {
        "tools": "tools", # Changed from "continue" to "tools"
        "agent": "agent", # Loop back to agent if no tool and not final list
        END: END, # Use END constant
    },
)
workflow.add_edge("tools", "agent")

# Compile the graph
app = workflow.compile()
app.name = "List Generation Agent"
