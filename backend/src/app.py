from fastapi import FastAPI, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(debug=True)

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


@app.post("/document/upload")
async def upload_document(file: UploadFile):
    if file.content_type != "text/plain":
        raise HTTPException(
            status_code=400,
            detail=(
                "Unexpected file format expected 'text/plain' " f"but received {file.content_type}."
            ),
        )
    

    return {
        "code": 200,
        "message": "File uploaded successfully",
    }
