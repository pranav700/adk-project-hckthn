from fastapi import APIRouter, HTTPException
from google.cloud import firestore
from datetime import datetime

router = APIRouter()
db = firestore.Client()


@router.get("/api/dashboard-data")
def get_dashboard_data():
    try:
        versions_ref = db.collection("procurement_versions")
        status_ref = db.collection("quote_status")

        # Stream all versions (consider adding a limit here)
        versions = versions_ref.stream()

        data = []
        for doc in versions:
            v = doc.to_dict()
            request_id = v.get("request_id")
            step_outputs = v.get("step_outputs", {})
            ts = v.get("timestamp") or v.get("version_ts")

            # Firestore timestamps are usually Timestamp objects
            if hasattr(ts, "to_datetime"):
                last_updated = ts.to_datetime()
            elif isinstance(ts, str):
                ts_fixed = ts.replace("Z", "+00:00")
                last_updated = datetime.fromisoformat(ts_fixed)
            else:
                last_updated = ts  # fallback, might be None

            doc_agent = step_outputs.get("doc_agent", {})
            quote_id = doc_agent.get("quote_id")
            company_name = doc_agent.get("supplier_name")

            # Fetch status document
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
                    "last_updated": last_updated,
                }
            )

        # Sort by last_updated descending, limit 100
        data = sorted(
            data, key=lambda x: x["last_updated"] or datetime.min, reverse=True
        )[:100]

        return data

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
