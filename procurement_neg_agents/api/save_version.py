# routes/save_version.py

from fastapi import APIRouter, Body, HTTPException
from google.cloud import firestore

router = APIRouter()
db = firestore.Client()


@router.post("/api/save-version")
def save_version(payload: dict = Body(...)):
    try:
        doc_data = {
            "request_id": payload["requestId"],
            "user_id": payload["userId"],
            "session_id": payload["sessionId"],
            "app_name": payload["appName"],
            "version_ts": payload.get("timestamp"),
            "step_outputs": payload["stepOutputs"],
            "quote_status": payload["quote_status"],
        }

        # Optionally use a generated document ID, or a timestamp-based key
        db.collection("procurement_versions").add(doc_data)

        return {"status": "ok"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
