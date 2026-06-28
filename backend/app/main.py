from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware

from app.models import RawEvent, UserReportCreate, Incident
from app.mock_data import MOCK_EVENTS
from app.services.incident_service import generate_incidents


from datetime import datetime, timezone

app = FastAPI(
    title = "SignalFlow AI API",
    description = " Backend API for the SignalFlow AI incident intelligence platform",
    version = "0.4.0",
)

origins = [
    "http://localhost:3000",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "message": "SignalFlow AI backend is running."
    }


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "signalflow-ai-api",
        "version": "0.4.0",
    }

@app.get("/events", response_model=list[RawEvent])
def get_events():
    return MOCK_EVENTS

@app.post("/reports", response_model=RawEvent, status_code=status.HTTP_201_CREATED)
def create_user_report(report: UserReportCreate):
    next_id = max(event.id for event in MOCK_EVENTS) + 1 #finds biggest current id and add 1

    new_event = RawEvent(
        id = next_id,
        source ="user_submitted",
        category="user_report",
        title=f"User Report: {report.location_name}",
        message=report.message,
        location_name=report.location_name,
        latitude=42.8175,
        longitude=-73.9300,
        timestamp=datetime.now(timezone.utc).isoformat(),
        severity=report.severity,
        status="active",
    )

    MOCK_EVENTS.append(new_event) #temporary storage before PostgreSQL database

    return new_event

@app.get("/incidents", response_model=list[Incident])
def get_incidents():
    return generate_incidents(MOCK_EVENTS)
