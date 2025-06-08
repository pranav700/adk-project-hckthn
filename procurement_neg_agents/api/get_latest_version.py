from fastapi import APIRouter, Path, HTTPException
from google.cloud import firestore
from google.cloud.firestore_v1.base_query import FieldFilter


router = APIRouter()
db = firestore.Client()


@router.get("/api/latest-version/{request_id}")
def get_latest_version(request_id: str = Path(...)):
    try:
        print(f"Querying for request_id: {request_id}")
        versions_ref = db.collection("procurement_versions").where(
            filter=FieldFilter("request_id", "==", request_id)
        )

        docs = list(versions_ref.stream())
        print(f"Matched {len(docs)} documents")

        if docs:
            latest = docs[0]
            doc = latest.to_dict()
            return doc
        else:
            return {"message": "No document found for given request_id"}

    except Exception as e:
        import traceback

        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
