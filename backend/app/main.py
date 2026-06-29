from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware

from app.models import RawEvent, UserReportCreate, Incident
from app.services.incident_service import generate_incidents

from contextlib import asynccontextmanager

from app.database import (
    create_database_tables,
    get_all_events,
    get_next_event_id,
    save_event,
    seed_initial_events_if_needed,
)

from datetime import datetime, timezone

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_database_tables()
    seed_initial_events_if_needed()
    yield # The app is now running and can receive requests


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
    new_event = RawEvent(
        id =get_next_event_id(),
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

    return save_event(new_event)

@app.get("/incidents", response_model=list[Incident])
def get_incidents():
    events = get_all_events()
    return generate_incidents(events)
