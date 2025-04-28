import json
import os
import random
import tempfile
import traceback
import uuid

from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import logfire

import src.file_handlers as fh
from src.narrative import generate_narrative
from src.utils import get_current_utc_time

logfire.configure(send_to_logfire=True)
logfire.instrument_openai()
app = FastAPI(debug=True)

# TODO: Settings probably need to be more robust
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)


os.makedirs("./data", exist_ok=True)

# TODO: This only works for the first run not stateful
annotations = []
if os.path.exists("./data/annotations.json"):
    with open("./data/annotations.json", "r") as f:
        annotations = json.load(f)


@app.post("/search")
async def search(query: str):
    return {"code": 200, "query": query}


@app.get("/annotations")
def retrieve_annotations(size: int = 9):
    """Endpoint to retrieve annotations from the database."""
    with open("./data/annotations.json", "r") as f:
        annotations = json.load(f)

    n_annos = len(annotations)
    logfire.info(f"Found {n_annos} annotations")
    if n_annos == 0:
        return {"annotations": []}

    indexes = [random.randrange(n_annos) for _ in range(9)]
    choices = [annotations[i] for i in indexes]
    return {"annotations": choices}


@app.post("/document/upload/kindle")
async def process_kindle_file(file: UploadFile):
    """Endpoint to handle upload of my clippings file."""

    if file.content_type != "text/plain":
        raise HTTPException(
            status_code=400,
            detail=(
                "Unexpected file format expected 'text/plain' " f"but received {file.content_type}."
            ),
        )

    try:
        with tempfile.TemporaryDirectory() as temp_dir:
            filename = file.filename or "tmp_file"
            temp_file_path = os.path.join(temp_dir, filename)

            with open(temp_file_path, "wb") as temp_file:
                content = await file.read()
                temp_file.write(content)

            annotations = fh.kindle.extract_annotations_from_file(temp_file_path)

            # TODO: Only add new items to the database
            # TODO: Configure file path so no errors
            with open("./data/annotations.json", "w") as f:
                annotations = [
                    {"id": str(uuid.uuid4()), **a.model_dump(mode="json")} for a in annotations
                ]
                json.dump(annotations, f, indent=4, ensure_ascii=False)

            logfire.info(f"Found {len(annotations)} annotations")
    except Exception as e:
        error_detail = traceback.format_exc()
        logfire.error(f"Error processing kindle file: {e}")
        print(f"Traceback: {error_detail}")
        raise HTTPException(
            status_code=500,
            detail="Error processing kindle file. Please try again later.",
        )
    finally:
        # Clean up the temporary file
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)

        # Clean up json file if corrupted
        if os.path.exists("./data/annotations.json"):
            try:
                with open("./data/annotations.json", "r") as f:
                    json.load(f)
            except json.JSONDecodeError:
                os.remove("./data/annotations.json")
                logfire.error("Corrupted annotations file removed.")

    return {
        "total_annotations": len(annotations),
    }


class TrailItemBody(BaseModel):
    """Trail object to be used in the API."""

    id: str
    content: str
    title: str
    authors: str


class TrailRequest(BaseModel):
    """Trail object to be used in the API."""

    trail: list[TrailItemBody]


@app.post("/trail")
def create_trail(trailRequest: TrailRequest):
    """Endpoint to handle trails."""
    trail_id = str(uuid.uuid4())
    if not trailRequest.trail:
        raise HTTPException(
            status_code=400,
            detail="No trail items provided.",
        )

    first_item = trailRequest.trail[0]
    trail_name = first_item.content[:50]  # TODO: Summary using LLMs

    trail = {
        "id": trail_id,
        "name": trail_name,
        "created_at": get_current_utc_time(),
        "nodes": [t.model_dump(mode="json") for t in trailRequest.trail],
        "narrative_id": str(uuid.uuid4()),
        "narrative": None,
    }

    try:
        trails = []
        if os.path.exists("./data/trails.json"):
            with open(f"./data/trails.json", "r") as f:
                trails = json.load(f)

        with open(f"./data/trails.json", "w") as f:
            if not trails:
                trails = []
            trails.append(trail)
            json.dump(trails, f, indent=4, ensure_ascii=False)

        # Generate the narrative with LLM
        logfire.info("Generating narrative...")
        notes = ""
        for index, item in enumerate(trail["nodes"]):
            note_str = f"Note {index}\n id: {item['id']}, book_title: {item['title']}, authors: {item['authors']}, content: {item['content']}\n"
            notes += note_str

        narrative = generate_narrative(notes=notes)
        narrative_data = None
        if narrative:
            narrative_data = {}
            narrative_data["id"] = trail["narrative_id"]
            narrative_data["title"] = narrative.title
            narrative_data["content"] = narrative.content
            narrative_data["references"] = [
                {"id": ref.id, "text": ref.text} for ref in narrative.references
            ]
            narrative_data["thumbnail_url"] = (
                "/public/narrative_image.png"  # TODO: Generate thumbnail
            )
            logfire.info("Narrative generated successfully. Saving...")

            narratives = []
            if os.path.exists("./data/trail_narratives.json"):
                with open("./data/trail_narratives.json", "r") as f:
                    narratives = json.load(f)
            with open(f"./data/trail_narratives.json", "w") as f:
                if not narratives:
                    narratives = []
                narratives.append(narrative_data)
                json.dump(narratives, f, indent=4, ensure_ascii=False)

            trail["narrative"] = narrative_data
            logfire.info("Trail and narrative saved successfully.")
        else:
            logfire.warning("Failed to generate narrative")

    except Exception as e:
        error_detail = traceback.format_exc()
        logfire.error(f"Error creating trail: {e}")
        print(f"Traceback: {error_detail}")
        raise HTTPException(
            status_code=500,
            detail="Error creating trail. Please try again later.",
        )

    return {"trail": trail}


@app.get("/trail/{trail_id}")
def get_trail(trail_id: str):
    """Endpoint to retrieve a specific trail."""
    with open("./data/trails.json", "r") as f:
        trails = json.load(f)

    with open("./data/trail_narratives.json", "r") as f:
        narratives = json.load(f)

    trail = None
    for t in trails:
        if t["id"] == trail_id:
            trail = t
            break

    if trail:
        narrative = None
        for n in narratives:
            if n["id"] == trail["narrative_id"]:
                narrative = n
                break

        trail = {
            "id": trail["id"],
            "name": trail["name"],
            "created_at": trail["created_at"],
            "nodes": trail["nodes"],
            "narrative_id": trail["narrative_id"],
            "narrative": {
                "id": trail["narrative_id"],
                "title": narrative["title"] if narrative else None,
                "content": narrative["content"] if narrative else None,
                "references": narrative["references"] if narrative else None,
                "thumbnail_url": narrative["thumbnail_url"] if narrative else None,
            },
        }
        return {"trail": trail}

    raise HTTPException(status_code=404, detail="Trail not found.")


@app.get("/trail")
def get_trails():
    """Endpoint to retrieve all trails."""
    with open("./data/trails.json", "r") as f:
        trails = json.load(f)

    return trails
