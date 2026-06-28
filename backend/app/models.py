from typing import Literal 
from pydantic import BaseModel, Field 

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

# Shape of an incoming form data 
class UserReportCreate(BaseModel):
    message: str = Field(min_length= 5, max_length=500) # lengths are in characters
    location_name: str = Field(min_length=2, max_length=100)
    severity:SeverityLevel
