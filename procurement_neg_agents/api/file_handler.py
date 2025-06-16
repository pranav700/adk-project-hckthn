import base64
from datetime import timedelta
from fastapi import APIRouter, HTTPException
from google.cloud import storage
import logging
import os

from modals.models import UploadRequest
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()


# GCS bucket name (replace with your actual bucket)
GCS_BUCKET_NAME = os.environ.get("GCS_BUCKET_NAME")


def upload_to_gcs(data: bytes, filename: str, content_type: str) -> str:
    try:
        logging.info(
            f"Uploading file to GCS bucket: {GCS_BUCKET_NAME}, filename: {filename}"
        )
        client = storage.Client()

        bucket = client.bucket(GCS_BUCKET_NAME)
        blob = bucket.blob(filename)
        blob.upload_from_string(data, content_type=content_type)
        # url = blob.generate_signed_url(expiration=timedelta(minutes=15), method="GET")

        return {"message": "File uploaded successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload file: {str(e)}")


@router.post("/api/upload-file")
def upload_file(req: UploadRequest):
    try:
        binary_data = base64.b64decode(req.base64_data)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid base64 data")

    # Create a structured filename
    filename = f"{req.id}/{req.session_id}/{req.user_id}"

    status = upload_to_gcs(binary_data, filename, req.mimetype)
    return {"status": status}


@router.get("/api/download-file")
def generate_signed_url(id: str, user_id: str, session_id: str):
    prefix = f"{id}/{session_id}/{user_id}"
    client = storage.Client()
    bucket = client.bucket(GCS_BUCKET_NAME)
    blobs = list(bucket.list_blobs(prefix=prefix))

    if not blobs:
        raise HTTPException(status_code=404, detail="File not found")

    blob = blobs[0]
    signed_url = blob.generate_signed_url(
        expiration=timedelta(minutes=15), method="GET"
    )
    return {"url": signed_url}
