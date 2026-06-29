from contextlib import asynccontextmanager
from datetime import datetime, timezone

from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware

from app.database import create_database_tables
from app.models import Incident, RawEvent, UserReportCreate
from app.repositories.event_repositories import (
    get_all_events,
    get_next_event_id,
    save_event,
)
from app.seed import seed_initial_events_if_needed
from app.services.incident_service import generate_incidents
from app.services.report_classifier import (
    build_report_title,
    classify_report_category,
    suggest_report_severity,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_database_tables()
    seed_initial_events_if_needed()
    yield


app = FastAPI(
    title="SignalFlow AI API",
    description="Backend API for the SignalFlow AI incident intelligence platform.",
    version="0.5.0",
    lifespan=lifespan,
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
        "version": "0.5.0",
    }


@app.get("/events", response_model=list[RawEvent])
def get_events():
    return get_all_events()


@app.post("/reports", response_model=RawEvent, status_code=status.HTTP_201_CREATED)
def create_user_report(report: UserReportCreate):
    predicted_category = classify_report_category(report)
    predicted_severity = suggest_report_severity(report)
    title = build_report_title(
        report=report,
        category=predicted_category,
    )
    new_event = RawEvent(
        id=get_next_event_id(),
        source="user_submitted",
        category=predicted_category,
        title=title,
        message=report.message,
        location_name=report.location_name,
        latitude=42.8175,
        longitude=-73.9300,
        timestamp=datetime.now(timezone.utc).isoformat(),
        severity=predicted_severity,
        status="active",
    )

    return save_event(new_event)


@app.get("/incidents", response_model=list[Incident])
def get_incidents():
    events = get_all_events()

    return generate_incidents(events)
