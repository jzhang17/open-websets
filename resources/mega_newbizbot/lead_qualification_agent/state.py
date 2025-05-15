"""Define the state structures for the agent."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Sequence, List, Dict, Any, Optional, Union
import operator

from langchain_core.messages import AnyMessage
from langgraph.graph import add_messages
from langgraph.managed import IsLastStep
from typing_extensions import Annotated

# Custom reducer for qualified_leads
def qualified_leads_reducer(
    existing_leads: Optional[List[Dict[str, Any]]],
    update: Union[List[Dict[str, Any]], Dict[str, Any]]
) -> List[Dict[str, Any]]:
    """
    Custom reducer for the 'qualified_leads' field.
    - If 'update' is a list, it appends to existing_leads.
    - If 'update' is a dictionary with '__replace_leads__': True and a 'data' key,
      it replaces existing_leads with update['data'].
    """
    if existing_leads is None:
        existing_leads = []

    if isinstance(update, dict) and update.get("__replace_leads__") is True:
        # Ensure 'data' key exists and is a list for replacement
        return update.get("data", []) if isinstance(update.get("data"), list) else []
    elif isinstance(update, list):
        return existing_leads + update
    # If update is not a list or the special dict, return existing leads (or handle error)
    # For robustness, might log a warning or raise an error if update type is unexpected
    return existing_leads


@dataclass
class InputState:
    """Defines the input state for the agent, representing a narrower interface to the outside world.

    This class is used to define the initial state and structure of incoming data.
    """

    messages: Annotated[Sequence[AnyMessage], add_messages] = field(
        default_factory=list
    )
    """
    Messages tracking the primary execution state of the agent.

    Typically accumulates a pattern of:
    1. HumanMessage - user input
    2. AIMessage with .tool_calls - agent picking tool(s) to use to collect information
    3. ToolMessage(s) - the responses (or errors) from the executed tools
    4. AIMessage without .tool_calls - agent responding in unstructured format to the user
    5. HumanMessage - user responds with the next conversational turn

    Steps 2-5 may repeat as needed.

    The `add_messages` annotation ensures that new messages are merged with existing ones,
    updating by ID to maintain an "append-only" state unless a message with the same ID is provided.
    """


@dataclass
class State(InputState):
    """Represents the complete state of the agent, extending InputState with additional attributes.

    This class can be used to store any information needed throughout the agent's lifecycle.
    """

    entities_to_qualify: List[str] = field(default_factory=list)
    """The list of entity names (strings) passed from the parent graph to be qualified in this run."""

    qualified_leads: Annotated[List[Dict[str, Any]], qualified_leads_reducer] = field(default_factory=list)
    """Accumulated list of qualification results (dictionaries) for entities."""

    verification_results: Dict[str, Any] = field(default_factory=dict)
    """Results from the verification tool checking consistency."""

    verification_loop_count: int = 0
    """Count of iterations within the verification loop."""

    loop_count: int = 0
    """Counter to prevent infinite loops between verification and agent nodes."""

    is_last_step: IsLastStep = field(default=False)
    """
    Indicates whether the current step is the last one before the graph raises an error.

    This is a 'managed' variable, controlled by the state machine rather than user code.
    It is set to 'True' when the step count reaches recursion_limit - 1.
    """

    # Additional attributes can be added here as needed.
    # Common examples include:
    # retrieved_documents: List[Document] = field(default_factory=list)
    # extracted_entities: Dict[str, Any] = field(default_factory=dict)
    # api_connections: Dict[str, Any] = field(default_factory=dict)
