"""Parses export documents from readwise"""

from datetime import datetime

import logfire
import pandas as pd
from tqdm import tqdm

from src.schemas import (
    RawBookAnnotation,
    BookAnnotationType,
)

AUTHOR_SEPARATOR = ";"


def validate_readwise_csv(filepath: str) -> bool:
    """
    Just check for existence of column names in the header
    Should really check for the type of the columns as well
    """
    contents = pd.read_csv(filepath, delimiter=",", header=0)
    header = contents.columns.tolist()
    expected_header = [
        "Highlight",
        "Book Title",
        "Book Author",
        "Amazon Book ID",
        "Note",
        "Color",
        "Tags",
        "Location Type",
        "Location",
        "Highlighted at",
        "Document tags",
    ]
    if header != expected_header:
        logfire.info(f"Invalid header: {header}. Expected: {expected_header}")
        return False

    return True


def parse_author(raw_author: str) -> str:
    """
    Parse the author string. Split multiple authors by semicolon.
    Separate multiple authors by " and " or ",".
    """
    authors = [a.strip() for a1 in raw_author.split(",") for a in a1.split(" and ") if a.strip()]
    authors = [author.strip() for author in authors]
    return AUTHOR_SEPARATOR.join(authors)


def process_readwise_csv(filepath: str, min_annotation_chars: int = 40) -> list[RawBookAnnotation]:
    """
    Parse a valid readwise export file and return a list of
    annotation objects.

    Readwise csv schema:
    - Highlight: str
    - Book Title: str
    - Book Author: str
    - Amazon Book ID: str
    - Note: str | nan
    - Color: str
    - Tags: str
    - Location Type: str [page, location]
    - Location: int
    - Highlighted at: datetime
    - Document tags: str | nan
    """
    data = pd.read_csv(filepath, delimiter=",", header=0)
    annotations = []
    highlights_added = 0
    notes_added = 0
    n_skipped = 0
    logfire.info(f"Processing {len(data)} rows")
    for idx, row in tqdm(data.iterrows()):
        try:
            highlight = row["Highlight"]
            title = row["Book Title"]
            authors = row["Book Author"]
            # amazon_id = row["Amazon Book ID"]
            note = row["Note"]
            # color = row["Color"]
            # tags = row["Tags"]
            location_type = row["Location Type"]
            location = row["Location"]
            highlighted_at = row["Highlighted at"]
            # document_tags = row["Document tags"]
            if pd.isna(highlight):
                logfire.info(f"Skipping row index {idx} with highlight: {highlight}")
                n_skipped += 1
                continue

            if len(highlight) < min_annotation_chars:
                logfire.info(
                    f"Skipping row index {idx} with highlight: {highlight} "
                    f"with length {len(highlight)} < {min_annotation_chars}"
                )
                n_skipped += 1
                continue

            authors = parse_author(authors) if pd.notna(authors) else None
            location_type = location_type if pd.notna(location_type) else "location"
            location_start = int(location) if pd.notna(location) else None
            date_annotated = (
                datetime.fromisoformat(highlighted_at) if pd.notna(highlighted_at) else None
            )
            highlight = RawBookAnnotation(
                title=title,
                authors=authors,
                content=highlight,
                annotation_type=BookAnnotationType.HIGHLIGHT,
                location_type=location_type,
                location_start=location_start,
                location_end=None,
                date_annotated=date_annotated,
            )
            annotations.append(highlight)
            highlights_added += 1

            if pd.notna(note):
                note = RawBookAnnotation(
                    title=title,
                    authors=authors,
                    content=note,
                    annotation_type=BookAnnotationType.COMMENT,
                    location_type=location_type,
                    location_start=location_start,
                    location_end=None,
                    date_annotated=date_annotated,
                )
                annotations.append(note)
                notes_added += 1

        except Exception as e:
            n_skipped += 1
            logfire.error(f"Error parsing row {idx} in ({title}, {authors}, {highlight}): {e}")

    logfire.info(f"Processed {len(data)} rows")
    logfire.info(f"Found {highlights_added} highlights and {notes_added} notes")
    logfire.info(f"Skipped {n_skipped} rows")
    return annotations
