from fastapi import APIRouter, HTTPException
from google.cloud import firestore
from datetime import datetime

router = APIRouter()
db = firestore.Client()


@router.get("/api/dashboard-data")
def get_dashboard_data():
    try:
        versions_ref = db.collection("procurement_versions")
        versions = list(versions_ref.stream())

        grouped = {}
        for doc in versions:
            v = doc.to_dict()
            request_id = v.get("request_id")
            if not request_id:
                continue

            ts = v.get("timestamp") or v.get("version_ts")
            if hasattr(ts, "to_datetime"):
                last_updated = ts.to_datetime()
            elif isinstance(ts, str):
                ts_fixed = ts.replace("Z", "+00:00")
                last_updated = datetime.fromisoformat(ts_fixed)
            else:
                last_updated = ts or datetime.min

            step_outputs = v.get("step_outputs", {})
            doc_agent = step_outputs.get("doc_agent", {})
            entry = {
                "last_updated": last_updated,
                "quote_status": v.get("quote_status"),
                "quote_id": doc_agent.get("quote_id"),
                "company_name": doc_agent.get("supplier_name"),
            }

            if request_id not in grouped:
                grouped[request_id] = []
            grouped[request_id].append(entry)

        result = []
        for request_id, versions in grouped.items():
            # Sort all versions by last_updated descending
            versions_sorted = sorted(
                versions, key=lambda x: x["last_updated"], reverse=True
            )
            latest = versions_sorted[0]

            # Try to fill missing quote_id and company_name from previous versions
            quote_id = latest["quote_id"]
            company_name = latest["company_name"]

            if not quote_id or not company_name:
                for v in versions_sorted[1:]:
                    if not quote_id:
                        quote_id = v.get("quote_id")
                    if not company_name:
                        company_name = v.get("company_name")
                    if quote_id and company_name:
                        break

            # Skip if we still don't have required fields
            if not quote_id or not company_name:
                continue

            result.append(
                {
                    "request_id": request_id,
                    "quote_id": quote_id,
                    "company_name": company_name,
                    "quote_status": latest["quote_status"],
                    "last_updated": latest["last_updated"],
                }
            )

        # Sort final result by last_updated and limit to 100
        result = sorted(result, key=lambda x: x["last_updated"], reverse=True)[:100]

        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
