"""Script to import highlights from Readwise into the database."""

import argparse
import json
from uuid import uuid4

import logfire

from src.file_handlers import readwise

logfire.configure(send_to_logfire=False)


def parser():
    """Parse command line arguments."""
    parser = argparse.ArgumentParser(description="Import highlights from Readwise.")
    parser.add_argument(
        "--readwise-file",
        type=str,
        required=True,
        help="CSV export of data from readwise",
    )
    parser.add_argument(
        "--db-location",
        type=str,
        required=True,
        help="Location of JSON database to import into",
    )
    parser.add_argument(
        "--min-annotation-chars",
        type=int,
        default=40,
        help="Minimum number of characters in an annotation to be imported",
    )

    parser.add_argument(
        "--overwrite",
        action="store_true",
        help="Overwrite existing database if it exists",
    )
    return parser.parse_args()


def main():
    """Main function to import highlights from Readwise."""
    args = parser()
    readwise_file = args.readwise_file
    db_location = args.db_location
    overwrite_db = args.overwrite
    min_annotation_chars = args.min_annotation_chars

    # Check if the database exists
    try:
        with open(db_location, "r") as f:
            db = json.load(f)
    except FileNotFoundError:
        db = []
    except json.JSONDecodeError:
        print(f"Error: {db_location} is not a valid JSON file.")
        return
    except Exception as e:
        print(f"Error: {e}")
        return

    # Check if the database is empty or if we want to overwrite it
    if not len(db) or overwrite_db:
        content_hashes = set()
        db = []
    else:
        # Generate content hashes for existing annotations
        content_hashes = set(hash(annotation["content"] + annotation["title"]) for annotation in db)

    processed_annotations = readwise.process_readwise_csv(
        readwise_file,
        min_annotation_chars=min_annotation_chars,
    )

    # Filter out duplicates
    processed_annotations = [
        annotation
        for annotation in processed_annotations
        if hash(annotation.content + annotation.title) not in content_hashes
    ]
    # Add UUIDs to the annotations and append to the database
    #
    for annotation in processed_annotations:
        record = {
            "id": str(uuid4()),
            "title": annotation.title,
            "authors": annotation.authors,
            "content": annotation.content,
            "annotation_type": annotation.annotation_type,
            "location_type": annotation.location_type,
            "location_start": annotation.location_start,
            "location_end": annotation.location_end,
            "date_annotated": annotation.date_annotated.isoformat(),
        }
        db.append(record)

    # Write the updated database to the file
    with open(db_location, "w") as f:
        json.dump(db, f, indent=4)

    print(
        f"Imported {len(processed_annotations)} annotations from {readwise_file} to {db_location}"
    )


if __name__ == "__main__":
    main()
