from fastapi import APIRouter, HTTPException
from google.cloud import bigquery

from config.config import BIGQUERY_TABLE

router = APIRouter()
client = bigquery.Client()


@router.get("/api/dashboard-data")
def get_dashboard_data():
    query = f"""
    SELECT 
        request_id,
        quote_id,
        company_name,
        quote_status,
        TIMESTAMP_MILLIS(MAX(UNIX_MILLIS(version_ts))) AS last_updated
    FROM `{BIGQUERY_TABLE}`
    GROUP BY request_id, quote_id, company_name, status
    ORDER BY last_updated DESC
    LIMIT 100
    """
    try:
        rows = client.query(query).result()
        return [dict(row) for row in rows]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
