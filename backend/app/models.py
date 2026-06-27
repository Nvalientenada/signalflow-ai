from typing import Literal 
from pydantic import BaseModel 

EventCategory = Literal[
    "weather",
    "transportation",
    "building",
    "power",
    "network",
    "user_report",
]

SeverityLevel = Literal[
    "low",
    "medium",
    "high",
]

class RawEvent(BaseModel):
    id:int
    source: str
    category: EventCategory
    title: str
    message: str
    location_name: str 
    latitude: float
    longitude: float
    timestamp: str 
    severity: SeverityLevel
    status: str 
    