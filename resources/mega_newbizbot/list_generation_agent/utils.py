"""Utility & helper functions."""

from typing import Optional
from langchain.chat_models import init_chat_model
from langchain_core.language_models import BaseChatModel
from langchain_core.messages import BaseMessage


def get_message_text(msg: BaseMessage) -> str:
    """Get the text content of a message."""
    content = msg.content
    if isinstance(content, str):
        return content
    elif isinstance(content, dict):
        return content.get("text", "")
    else:
        txts = [c if isinstance(c, str) else (c.get("text") or "") for c in content]
        return "".join(txts).strip()


def load_chat_model(fully_specified_name: Optional[str] = None, **kwargs) -> BaseChatModel:
    """Load a chat model from a fully specified name.

    Args:
        fully_specified_name (Optional[str]): String in the format 'provider/model'.
            If None, uses the default from Configuration.
        **kwargs: Additional keyword arguments to pass to the model constructor.
    """
    from list_generation_agent.configuration import Configuration
    
    if fully_specified_name is None:
        fully_specified_name = Configuration().model
        
    provider, model = fully_specified_name.split("/", maxsplit=1)
    return init_chat_model(model, model_provider=provider, **kwargs)