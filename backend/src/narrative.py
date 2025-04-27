"""Code to generate a narrative companion for list of events"""

from magentic import chatprompt, OpenaiChatModel, SystemMessage, UserMessage
from pydantic import BaseModel, Field

from src.prompts import system_narrative_prompt, user_narrative_prompt


class Reference(BaseModel):
    id: str = Field(description="The original node ID. This is UUID4 format")
    text: str = Field(
        description="The exact text in your narrative that should be linked to this reference"
    )


class Narrative(BaseModel):
    title: str = Field(description="Your intriguing, personal title here")
    content: str = Field(description="The full narrative text here")
    references: list[Reference] = Field(description="List of references to the original notes")


class Notes(BaseModel):
    id: str = Field(description="The original node ID. This is UUID4 format")
    book_title: str = Field(description="The title of the book")
    authors: str = Field(description="The authors of the book")
    content: str = Field(description="The content of the note")


@chatprompt(
    SystemMessage(system_narrative_prompt),
    UserMessage(user_narrative_prompt),
    model=OpenaiChatModel("gpt-4o-mini"),
)
def generate_narrative(notes: str) -> Narrative:
    """
    Generate a narrative based on the provided notes.

    Args:
        notes (str): Json string notes to be used for generating the narrative.

    Returns:
        Narrative: The generated narrative.
    """
    pass
