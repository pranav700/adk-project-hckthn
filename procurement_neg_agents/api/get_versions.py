# routes/get_versions.py

from fastapi import APIRouter, Path, HTTPException
from google.cloud import firestore

router = APIRouter()
db = firestore.Client()


@router.get("/api/versions/{request_id}")
def get_versions(request_id: str = Path(...)):
    try:
        # Query Firestore collection for all versions of this request_id
        versions_ref = (
            db.collection("procurement_versions")
            .where("request_id", "==", request_id)
            .order_by("version_ts", direction=firestore.Query.DESCENDING)
        )

        docs = versions_ref.stream()
        return [doc.to_dict() for doc in docs]

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
