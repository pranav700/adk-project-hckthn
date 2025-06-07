from fastapi import APIRouter, HTTPException
from google.cloud import bigquery

from config.config import BIGQUERY_TABLE
from modals.models import StatusUpdate

router = APIRouter()
client = bigquery.Client()


@router.post("/update-status")
def update_status(payload: StatusUpdate):
    query = f"""
    UPDATE `{BIGQUERY_TABLE}`
    SET status = @status
    WHERE request_id = @request_id
    """
    job_config = bigquery.QueryJobConfig(
        query_parameters=[
            bigquery.ScalarQueryParameter("status", "STRING", payload.status.value),
            bigquery.ScalarQueryParameter("request_id", "STRING", payload.request_id),
        ]
    )
    try:
        client.query(query, job_config=job_config).result()
        return {"success": True, "message": f"Status updated to {payload.status.value}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
