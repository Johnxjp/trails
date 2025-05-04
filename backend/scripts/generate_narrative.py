"""
Script that will run periodically to generate a narrative from the database.

Steps

1. Load the database
2. Load the frequency stats of annotations
3. Randomly sample a selection between 3-5 annotations
4. Add up to 2 annotations that have not been frequently accessed
5. Create the thematic prompt with the annotations
6. Generate the narrative using the OpenAI API
7. Validate the narrative
8. Save the validated narrative to the database
"""

import argparse
from datetime import datetime
import json
import os
import random
import time
from typing import Any
from uuid import uuid4

import dotenv
import logfire

dotenv.load_dotenv()
logfire.configure(send_to_logfire=True)
logfire.instrument_openai()

from src.narrative import generate_narrative
from src.schemas import ModelOutputNarrative, NarrativeRecord, ReferenceRecord


def parser():
    """Parse command line arguments."""
    parser = argparse.ArgumentParser(description="Generate a narrative from the database.")
    parser.add_argument(
        "--annotations_db",
        type=str,
        default="../data/annotations.json",
        help="Location of the database file.",
    )
    parser.add_argument(
        "--frequency_stats_location",
        type=str,
        default="../data/frequency_stats.json",
        help="Location of the frequency stats file.",
    )
    parser.add_argument(
        "--narrative_db",
        type=str,
        default="../data/narratives.json",
        help="Location of the narrative file.",
    )
    return parser.parse_args()


# def validate_narrative(narrative: Any) -> bool:
#     """
#     Validate the generated narrative.

#     Args:
#         narrative (any): The generated narrative to validate.

#     Returns:
#         bool: True if the narrative is valid, False otherwise.
#     """
#     # Implement your validation logic here
#     # For example, check if the narrative has a title and content
#     logfire.info(f"Validating narrative. {narrative}")
#     try:
#         model_fields = narrative.model_fields
#     except Exception as e:
#         logfire.error(f"Error accessing model fields: {e}")
#         return False

#     if "title" not in model_fields:
#         logfire.error("Narrative does not contain a title.")
#         return False

#     if "content" not in model_fields:
#         logfire.error("Narrative does not contain content.")
#         return False

#     return True


def retry_generate_narrative(annotations: str, retries: int = 3) -> Any:
    """
    Retry generating a narrative with exponential backoff.

    Args:
        annotations (str): Json string annotations to be used for generating the narrative.
        retries (int): Number of retries.

    Returns:
        Any: The generated narrative.
    """
    for attempt in range(retries):
        try:
            logfire.info(f"Attempt {attempt + 1} to generate narrative.")
            return generate_narrative(annotations)
        except Exception as e:
            logfire.error(f"Attempt {attempt + 1} failed: {e}")
            if attempt < retries - 1:
                time.sleep(2**attempt)  # Exponential backoff
            else:
                logfire.error("Max retries reached. Exiting.")
                raise e


def main():
    """Main function to generate a narrative from the database."""
    args = parser()
    annotations_db = args.annotations_db
    frequency_stats_location = args.frequency_stats_location
    narrative_db = args.narrative_db

    if not os.path.exists(annotations_db):
        logfire.error(f"Annotations database not found at {annotations_db}")
        return

    # Load the database
    with open(annotations_db) as f:
        logfire.info(f"Loading annotations from {annotations_db}")
        annotations = json.load(f)

    # Load the frequency stats
    frequency_stats = {}
    if os.path.exists(frequency_stats_location):
        logfire.info(f"Loading existing frequency stats from {frequency_stats_location}")
        with open(frequency_stats_location) as f:
            frequency_stats = json.load(f)

    # Load the narrative database
    narratives = []
    if os.path.exists(narrative_db):
        logfire.info(f"Loading existing narratives from {narrative_db}")
        with open(narrative_db) as f:
            narratives = json.load(f)

    # Randomly sample a selection between 3-5 annotations
    selected_annotations = random.sample(annotations, random.randint(3, 5))

    # Add up to 2 annotations that have not been frequently accessed
    frequency_annotations = []
    for annotation in annotations:
        if annotation not in selected_annotations:
            if (
                annotation["id"] not in frequency_stats
                or frequency_stats[annotation["id"]]["count"] < 2
            ):
                frequency_annotations.append(annotation)

            if len(frequency_annotations) > 1:
                break

    selected_annotations.extend(frequency_annotations)
    selected_annotations_ids = [annotation["id"] for annotation in selected_annotations]
    logfire.info(f"Selected {len(selected_annotations)} annotations for narrative generation.")
    logfire.info(
        f"Selected annotation ids: {[annotation["id"] for annotation in selected_annotations]}"
    )

    # Update the frequency stats
    for annotation in selected_annotations:
        if annotation["id"] not in frequency_stats:
            frequency_stats[annotation["id"]] = {
                "count": 0,
                "last_accessed": datetime.now().isoformat(),
            }
        frequency_stats[annotation["id"]]["count"] += 1

    # Generate the narrative using the OpenAI API
    format_selected_annotations = [
        {
            "id": annotation["id"],
            "title": annotation["title"],
            "authors": annotation["authors"],
            "content": annotation["content"],
            "date_annotated": annotation["date_annotated"],
        }
        for annotation in selected_annotations
    ]
    annotations_str = json.dumps(format_selected_annotations)
    logfire.info(f"Annotations string: {annotations_str}")
    try:
        narrative = retry_generate_narrative(annotations_str, retries=3)
        logfire.info("Narrative generated successfully.")
    except Exception as e:
        logfire.error(f"Error generating narrative: {e}")
        return

    # Filter references not in selected annotations
    references = []
    for reference in narrative.references:
        if reference.annotation_id not in selected_annotations_ids:
            logfire.info(
                f"Reference {reference.annotation_id} not in selected annotations. Skipping."
            )
            continue

        record = ReferenceRecord(
            id=str(uuid4()),
            annotation_id=reference["annotation_id"],
            text=reference["text"],
        )
        references.append(record)

    # Create narrative record object
    thumbnail_url = f"/image_{random.randint(1, 13)}.jpeg"
    narrative_record = NarrativeRecord(
        id=str(uuid4()),
        title=narrative.title,
        content=narrative.content,
        references=references,
        thumbnail_url=thumbnail_url,
        date_created=datetime.now().isoformat(),
    )
    narratives.append(narrative_record.model_dump(mode="json"))
    # Save the validated narrative to the database
    with open(narrative_db, "w") as f:
        json.dump(narratives, f, indent=4)

    # Write the frequency stats back to the file
    with open(frequency_stats_location, "w") as f:
        json.dump(frequency_stats, f, indent=4)


if __name__ == "__main__":
    main()
