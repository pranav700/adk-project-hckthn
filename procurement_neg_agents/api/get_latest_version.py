# routes/get_latest_version.py

from fastapi import APIRouter, Path
from google.cloud import bigquery
from config.config import BIGQUERY_TABLE

router = APIRouter()
client = bigquery.Client()


@router.get("/api/latest-version/{request_id}")
def get_latest_version(request_id: str = Path(...)):
    query = f"""
    SELECT version_ts, step_outputs
    FROM `{BIGQUERY_TABLE}`
    WHERE request_id = @request_id
    ORDER BY version_ts DESC
    LIMIT 1
    """
    job = client.query(
        query,
        job_config=bigquery.QueryJobConfig(
            query_parameters=[
                bigquery.ScalarQueryParameter("request_id", "STRING", request_id)
            ]
        ),
    )
    rows = list(job.result())
    return dict(rows[0]) if rows else {}
