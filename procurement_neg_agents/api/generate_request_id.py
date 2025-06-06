# routes/generate_request_id.py

import random
import string
from fastapi import APIRouter
from google.cloud import bigquery
from config.config import BIGQUERY_TABLE


router = APIRouter()
client = bigquery.Client()


def generate_candidate_id():
    return "REQ-" + "".join(random.choices(string.ascii_uppercase + string.digits, k=6))


@router.post("/api/generate-request-id")
def generate_request_id():
    for _ in range(10):
        request_id = generate_candidate_id()
        query = f"SELECT COUNT(*) as count FROM `{BIGQUERY_TABLE}` WHERE request_id = @request_id"
        job = client.query(
            query,
            job_config=bigquery.QueryJobConfig(
                query_parameters=[
                    bigquery.ScalarQueryParameter("request_id", "STRING", request_id)
                ]
            ),
        )
        if list(job.result())[0].count == 0:
            return {"id": request_id}
    raise Exception("Unable to generate unique request ID.")
