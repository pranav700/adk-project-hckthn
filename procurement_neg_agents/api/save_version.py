# routes/save_version.py

from datetime import datetime
import json
from fastapi import APIRouter, Body, HTTPException
from google.cloud import firestore

router = APIRouter()
db = firestore.Client()


@router.post("/api/save-version")
def save_version(payload: dict = Body(...)):
    try:
        # Parse version_ts to datetime from ISO 8601 format
        version_ts_str = payload.get("timestamp")
        if not version_ts_str:
            raise ValueError("Missing 'timestamp' in payload")

        try:
            version_ts = datetime.fromisoformat(version_ts_str.replace("Z", "+00:00"))
        except Exception as e:
            raise ValueError(f"Invalid timestamp format: {e}")

        doc_data = {
            "request_id": payload["requestId"],
            "user_id": payload["userId"],
            "session_id": payload["sessionId"],
            "app_name": payload["appName"],
            "version_ts": version_ts,
            "step_outputs": json.loads(payload["stepOutputs"]),
            "quote_status": payload["quote_status"],
        }

        # Optionally use a generated document ID, or a timestamp-based key
        db.collection("procurement_versions").add(doc_data)

        return {"status": "ok"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
