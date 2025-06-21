# routes/generate_request_id.py

import random
import string
from fastapi import APIRouter, HTTPException
from google.cloud import firestore

router = APIRouter()
db = firestore.Client()


def generate_candidate_id():
    return "REQ-" + "".join(random.choices(string.ascii_uppercase + string.digits, k=6))


@router.post("/api/generate-request-id")
def generate_request_id():
    for _ in range(10):
        request_id = generate_candidate_id()

        # Check existence in Firestore (e.g., in "procurement_versions" collection)
        existing_doc = db.collection("procurement_versions").document(request_id).get()
        if not existing_doc.exists:
            return {"id": request_id}

    raise HTTPException(status_code=500, detail="Unable to generate unique request ID.")
