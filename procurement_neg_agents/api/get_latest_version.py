# routes/get_latest_version.py

from fastapi import APIRouter, Path, HTTPException
from google.cloud import firestore

router = APIRouter()
db = firestore.Client()


@router.get("/api/latest-version/{request_id}")
def get_latest_version(request_id: str = Path(...)):
    try:
        # Reference to all versions of this request
        versions_ref = (
            db.collection("procurement_versions")
            .where("request_id", "==", request_id)
            .order_by("version_ts", direction=firestore.Query.DESCENDING)
            .limit(1)
        )

        docs = versions_ref.stream()
        latest = next(docs, None)

        if latest:
            return latest.to_dict()
        else:
            return {}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
