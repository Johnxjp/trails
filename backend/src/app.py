import json
import os
import random
import tempfile
import traceback

from fastapi import FastAPI, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import logfire

import src.file_handlers as fh

app = FastAPI(debug=True)
logfire.configure(send_to_logfire=False)

# TODO: Settings probably need to be more robust
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)


os.makedirs("./data", exist_ok=True)
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
                annotations = [a.model_dump(mode="json") for a in annotations]
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

    return {
        "total_annotations": len(annotations),
    }
