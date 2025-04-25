import json
import os
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


@app.post("/search")
async def search(query: str):
    return {"code": 200, "query": query}


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
