from datetime import datetime
from enum import StrEnum
from typing import Optional

from pydantic import BaseModel

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
