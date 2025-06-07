# routes/save_version.py

from fastapi import APIRouter, Body
from google.cloud import bigquery
from config.config import BIGQUERY_TABLE

router = APIRouter()
client = bigquery.Client()


@router.post("/api/save-version-bq")
def save_version(payload: dict = Body(...)):
    row = {
        "request_id": payload["requestId"],
        "user_id": payload["userId"],
        "session_id": payload["sessionId"],
        "app_name": payload["appName"],
        "version_ts": payload.get("timestamp"),
        "step_outputs": payload["stepOutputs"],
        "quote_status": payload["quote_status"],
    }
    errors = client.insert_rows_json(BIGQUERY_TABLE, [row])
    if errors:
        raise Exception(f"BigQuery insert failed: {errors}")
    return {"status": "ok"}
