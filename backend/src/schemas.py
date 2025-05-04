from datetime import datetime
from enum import StrEnum
from typing import Optional

from pydantic import BaseModel, Field

BOOK_TITLE = str
BOOK_AUTHORS = str


class MessageRoles(StrEnum):
    SYSTEM = "system"
    USER = "user"


class BookAnnotationType(StrEnum):
    COMMENT = "comment"
    BOOKMARK = "bookmark"
    HIGHLIGHT = "highlight"


class DocumentType(StrEnum):
    BOOK = "book"
    VIDEO = "video"


class RawBookAnnotation(BaseModel):
    """Note from book with metadata"""

    title: str
    authors: Optional[str] = None
    content: str
    annotation_type: BookAnnotationType
    location_type: Optional[str] = None  # page or location
    location_start: Optional[int] = None
    location_end: Optional[int] = None
    date_annotated: Optional[datetime] = None


class BookAnnotation(RawBookAnnotation):
    id: str


class ModelOutputReference(BaseModel):
    annotation_id: str = Field(
        description="The ID of the annotation in the database. This is UUID4 format"
    )
    text: str = Field(
        description="The exact text in your narrative that should be linked to this reference"
    )


class ReferenceRecord(BaseModel):
    """Reference to the original note"""

    id: str = Field(description="The ID of the reference in the database. This is UUID4 format")
    annotation_id: str = Field(
        description="The ID of the annotation in the database. This is UUID4 format"
    )
    text: str = Field(
        description="The exact text in your narrative that should be linked to this reference"
    )


class ModelOutputNarrative(BaseModel):
    title: str = Field(description="Your intriguing, personal title here")
    content: str = Field(description="The full narrative text here")
    references: list[ModelOutputReference] = Field(
        description="List of references to the original notes"
    )


class NarrativeRecord(BaseModel):
    """Narrative record in the database"""

    id: str = Field(description="The ID of the narrative in the database. This is UUID4 format")
    date_created: str = Field(description="ISO formatted date date when the narrative was created")
    thumbnail_url: Optional[str] = Field(description="URL to the thumbnail image")
    references: list[ReferenceRecord] = Field(
        description="List of references to the original notes"
    )
    title: str = Field(description="The title of the narrative")
    content: str = Field(description="The content of the narrative")
