from enum import Enum
from pydantic import BaseModel


class RequestStatus(str, Enum):
    accepted = "accepted"
    countered = "countered"
    pending = "pending"
    rejected = "rejected"


# Payload for updating request status
class StatusUpdate(BaseModel):
    request_id: str
    quote_status: RequestStatus


# Define upload request model
class UploadRequest(BaseModel):
    id: str
    user_id: str
    session_id: str
    mimetype: str
    base64_data: str
