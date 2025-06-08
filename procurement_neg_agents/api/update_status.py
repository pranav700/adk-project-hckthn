from fastapi import APIRouter, HTTPException
from google.cloud import firestore
from modals.models import StatusUpdate

router = APIRouter()
db = firestore.Client()


@router.post("/api/update-status")
def update_status(payload: StatusUpdate):
    try:
        # Query for the latest document matching the request_id
        docs = (
            db.collection("procurement_versions")
            .where("request_id", "==", payload.request_id)
            .order_by("version_ts", direction=firestore.Query.DESCENDING)
            .limit(1)
            .stream()
        )

        doc = next(docs, None)
        if not doc:
            raise HTTPException(status_code=404, detail="Request ID not found.")

        # Update the quote_status field in the latest document
        doc.reference.update({"quote_status": payload.quote_status.value})

        return {
            "success": True,
            "message": f"Status updated to {payload.quote_status.value}",
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
