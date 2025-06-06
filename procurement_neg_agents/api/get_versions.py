# routes/get_versions.py

from fastapi import APIRouter, Path
from google.cloud import bigquery
from config.config import BIGQUERY_TABLE

router = APIRouter()
client = bigquery.Client()


@router.get("/api/versions/{request_id}")
def get_versions(request_id: str = Path(...)):
    query = f"""
    SELECT version_ts, step_outputs
    FROM `{BIGQUERY_TABLE}`
    WHERE request_id = @request_id
    ORDER BY version_ts DESC
    """
    job = client.query(
        query,
        job_config=bigquery.QueryJobConfig(
            query_parameters=[
                bigquery.ScalarQueryParameter("request_id", "STRING", request_id)
            ]
        ),
    )
    return [dict(row) for row in job.result()]
