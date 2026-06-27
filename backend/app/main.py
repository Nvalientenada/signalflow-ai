from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.models import RawEvent
from app.mock_data import MOCK_EVENTS

app = FastAPI(
    title = "SignalFlow AI API",
    description = " Backend API for the SignalFlow AI incident intelligence platform",
    version = "0.2.0",
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
        "version": "0.2.0",
    }

@app.get("/events", response_model=list[RawEvent])
def get_events():
    return MOCK_EVENTS
