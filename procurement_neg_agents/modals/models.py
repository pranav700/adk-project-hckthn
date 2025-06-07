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
