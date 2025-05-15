"""Define a custom Reasoning and Action agent.

Works with a chat model with tool calling support.
"""

from datetime import datetime, timezone
from typing import Dict, List, Literal, cast, TypedDict, Sequence, Optional, Any
import json
import re
import operator

from langchain_core.messages import AIMessage, BaseMessage, HumanMessage, ToolMessage
from langchain_core.runnables import RunnableConfig
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages
from typing_extensions import Annotated

from entity_extraction_agent.state import State
from entity_extraction_agent.configuration import Configuration
from entity_extraction_agent.tools import TOOLS
from entity_extraction_agent.utils import load_chat_model

# Use getattr to safely access attributes from the State dataclass
async def initialize_state(state: State, config: Optional[RunnableConfig] = None) -> Dict[str, Any]:
    """Initialize the state by putting the initial_context into the messages list."""
    # Safely get initial_context using getattr
    initial_context = getattr(state, "initial_context", "")
    # Safely get messages using getattr
    current_messages = getattr(state, "messages", [])

    update = {}
    if initial_context:
        update["initial_context"] = initial_context # Ensure initial_context is passed through if it exists
        if not current_messages: # Only add context to messages if messages are empty
            update["messages"] = [HumanMessage(content=initial_context)]
    return update

async def call_model(
    state: State, config: RunnableConfig
) -> Dict[str, List[AIMessage]]:
    """Call the LLM powering our "agent".

    This function prepares the prompt, initializes the model, and processes the response.

    Args:
        state (State): The current state of the conversation (using dataclass State).
        config (RunnableConfig): Configuration for the model run, can include callbacks.

    Returns:
        dict: A dictionary containing the model's response message update for the 'messages' field.
    """
    configuration = Configuration.from_runnable_config(config)

    # Initialize the model
    model = load_chat_model(configuration.model, thinking_budget=0)

    # Format the system prompt
    system_message = configuration.system_prompt.format(
        system_time=datetime.now(tz=timezone.utc).isoformat()
    )

    messages_to_send = [
        {"role": "system", "content": system_message},
        *[msg.dict() for msg in state.messages],
    ]

    # Bind tools to the model before invoking
    # Assuming load_chat_model doesn't handle this, we bind here.
    # If load_chat_model is updated, this line might be redundant.
    model = model.bind_tools(TOOLS)

    # Get the model's response, passing through any callbacks from config
    response = cast(
        AIMessage,
        await model.ainvoke(messages_to_send, config)
    )

    # The response AIMessage should now have a populated `tool_calls` attribute
    # if the model decided to call a tool. No manual parsing needed.

    # Return the response directly. The tool_node will check for tool_calls.
    return {"messages": [response]}

async def tool_node(state: State, config: Optional[RunnableConfig] = None) -> Dict[str, List[BaseMessage]]:
    """Execute tools based on the agent's request found in message.tool_calls.

    Args:
        state (State): The current state of the conversation (using dataclass State).
        config (Optional[RunnableConfig]): Optional configuration including callbacks.

    Returns:
        dict: A dictionary containing the tool's response message update for the 'messages' field.
    """
    tool_invocations = []
    last_message = state.messages[-1]
    # Check if the last message is an AIMessage and has tool_calls
    if isinstance(last_message, AIMessage) and hasattr(last_message, "tool_calls") and last_message.tool_calls:
        tools_dict = {tool.name: tool for tool in TOOLS}
        messages_update = []
        entities_update = [] # Collect entity updates separately

        for tool_call in last_message.tool_calls:
            tool_name = tool_call["name"]
            tool_args = tool_call["args"]
            tool_call_id = tool_call["id"] # Get the tool_call_id

            if tool_name in tools_dict:
                tool = tools_dict[tool_name]

                # Special handling for extract_entities tool
                if tool_name == "extract_entities":
                    # Invoke the simplified tool
                    if config: # Pass config if available
                        result_list = tool.invoke(tool_args, config=config)
                    else:
                        result_list = tool.invoke(tool_args)

                    # Accumulate entities for the state update
                    entities_update.extend(result_list)
                    # Add a message indicating entity reporting
                    messages_update.append(ToolMessage(content=f"Entities reported: {len(result_list)} new items.", tool_call_id=tool_call_id)) # Use ToolMessage

                else:
                    # Handle other tools normally
                    if hasattr(tool, 'ainvoke') and config: # Check for async and config
                        result = await tool.ainvoke(tool_args, config=config)
                    elif hasattr(tool, 'ainvoke'): # Check for async only
                        result = await tool.ainvoke(tool_args)
                    elif config: # Check for config only (sync)
                        result = tool.invoke(tool_args, config=config)
                    else: # Sync, no config
                        result = tool.invoke(tool_args)

                    # Add result as ToolMessage
                    messages_update.append(ToolMessage(content=str(result), tool_call_id=tool_call_id)) # Use ToolMessage
            else:
                # If tool not found, add an error message
                messages_update.append(ToolMessage(content=f"Error: Tool '{tool_name}' not found.", tool_call_id=tool_call_id)) # Use ToolMessage

        update_dict = {"messages": messages_update}
        if entities_update:
            update_dict["entities"] = entities_update # Add accumulated entities to the update dict
        return update_dict

    # Return empty message update if no tool calls were found or processed
    return {"messages": []}

def should_continue(state: State) -> Literal["__end__", "agent", "tools"]:
    """Determine the next step based on the last message's content and tool calls.

    Args:
        state (State): The current state of the conversation (using dataclass State).

    Returns:
        str: "tools" if a tool was called, "agent" if no tool call and no end tag, "__end__" if end tag present.
    """
    if not state.messages:
        return "__end__"

    last_message = state.messages[-1]

    # Check for native tool calls first
    if isinstance(last_message, AIMessage) and hasattr(last_message, "tool_calls") and last_message.tool_calls:
        return "tools"

    # Check for the end extraction tag in the content
    # Handle potential list content from Gemini 2.5
    content = last_message.content
    if isinstance(content, list):
        text_content = ""
        for item in content:
            if isinstance(item, str):
                text_content += item
            elif isinstance(item, dict) and "text" in item:
                text_content += item["text"]
        content = text_content
    elif not isinstance(content, str):
        content = str(content)

    if "<end_extraction/>" in content:
        return END # Use END constant

    # Otherwise, continue calling the agent
    return "agent"

# Define the graph structure
graph = StateGraph(State)

# Add the initialization node
graph.add_node("initialize", initialize_state) # type: ignore

# Add nodes for the agent and tool execution
graph.add_node("agent", call_model)
graph.add_node("tools", tool_node) # Use the updated tool_node

# Set the entry point to the initialization node
graph.set_entry_point("initialize")

# Add edges
graph.add_edge("initialize", "agent")

graph.add_conditional_edges(
    "agent",
    should_continue, # Use updated should_continue
    {
        "tools": "tools",
        "agent": "agent", # Loop back to agent if no tool call and no end tag
        END: END # Use END constant
    },
)

graph.add_edge("tools", "agent")

# Compile the graph
app = graph.compile()
