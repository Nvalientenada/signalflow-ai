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

IncidentStatus = Literal[
    "active",
    "monitoring",
    "resolved",
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

class Incident(BaseModel):
    id: int 
    title: str
    summary: str
    severity: SeverityLevel
    status: IncidentStatus
    affected_area: str
    recommended_action: str
    evidence_event_ids: list[int] # list of raw events supporting incident

# what to send to the AI analysis service
class IncidentAnalysisRequest(BaseModel):
    incident: Incident
    evidence_events:list[RawEvent]

# describes what the AI service returns 
class IncidentAnalysis(BaseModel):
    incident_id: int
    generated_summary: str
    recommended_action: str
    confidence_score: float
    reasoning_notes: list[str]

class AIStatus(BaseModel):
    use_llm_analysis: bool
    mode: str
    model: str
