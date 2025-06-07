from enum import Enum
from pydantic import BaseModel


class RequestStatus(str, Enum):
    accepted = "Accepted"
    countered = "Countered"
    pending = "Pending"
    rejected = "Rejected"


# Payload for updating request status
class StatusUpdate(BaseModel):
    request_id: str
    quote_status: RequestStatus
