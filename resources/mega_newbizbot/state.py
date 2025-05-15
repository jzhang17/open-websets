from typing import TypedDict, List, Dict, Any
from typing_extensions import Annotated
import operator


class MegaNewBizBotState(TypedDict):
    """Represents the state of the mega new biz bot agent."""
    initial_context: str
    all_entities: List[Dict[str, Any]]
    current_chunk: List[Dict[str, Any]]
    processed_entities_count: int
    qualified_leads: Annotated[List[Dict[str, Any]], operator.add] 