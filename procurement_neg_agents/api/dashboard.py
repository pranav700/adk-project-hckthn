from fastapi import APIRouter, HTTPException
from google.cloud import firestore
from datetime import datetime

router = APIRouter()
db = firestore.Client()


@router.get("/api/dashboard-data")
def get_dashboard_data():
    try:
        # Get the latest version for each request_id
        versions_ref = db.collection("procurement_versions")
        status_ref = db.collection("quote_status")

        # Fetch all documents (can optimize later with indexing/pagination)
        versions = versions_ref.stream()

        data = []
        for doc in versions:
            v = doc.to_dict()
            request_id = v.get("request_id")
            step_outputs = v.get("step_outputs", {})
            ts = v.get("timestamp") or v.get("version_ts")

            # Parse step outputs
            doc_agent = step_outputs.get("doc_agent", {})
            quote_id = doc_agent.get("quote_id")
            company_name = doc_agent.get("supplier_name")

            # Get status (if present) from status collection
            status_doc = status_ref.document(request_id).get()
            quote_status = (
                status_doc.to_dict().get("quote_status")
                if status_doc.exists
                else "Pending"
            )

            data.append(
                {
                    "request_id": request_id,
                    "quote_id": quote_id,
                    "company_name": company_name,
                    "quote_status": quote_status,
                    "last_updated": datetime.fromisoformat(ts)
                    if isinstance(ts, str)
                    else ts,
                }
            )

        # Sort by last_updated desc, limit to 100
        data = sorted(data, key=lambda x: x["last_updated"], reverse=True)[:100]

        return data

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
