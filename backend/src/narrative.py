"""Code to generate a narrative companion for list of events"""

from magentic import chatprompt, OpenaiChatModel, SystemMessage, UserMessage

from src.prompts import thematic_narrative_prompt, user_narrative_prompt
from src.schemas import ModelOutputNarrative


@chatprompt(
    SystemMessage(thematic_narrative_prompt),
    UserMessage(user_narrative_prompt),
    model=OpenaiChatModel("gpt-4o-mini"),
)
def generate_narrative(annotations: str) -> ModelOutputNarrative:
    """
    Generate a narrative based on the provided notes.

    Args:
        annotations (str): Json string annotations to be used for generating the narrative.

    Returns:
        Narrative: The generated narrative.
    """
    pass
