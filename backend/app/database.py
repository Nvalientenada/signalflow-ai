from sqlalchemy import create_engine, String, Float, Integer
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, sessionmaker

from app.models import RawEvent
from app.mock_data import MOCK_EVENTS

DATABASE_URL = "sqlite:///./signalflow.db" # storing database in signalflow.db

# engine is teh connection btw Python and the database
engine= create_engine(
    DATABASE_URL,
    connect_args = {"check_same_thread": False}, # needed when using FastAPI
)

# a session is how we talk to a database 
# every time we need data, we create a session
SessionLocal = sessionmaker(
    bind= engine,
    autoflush= False,
    autocommit= False,
)

# class SQLAlchemy uses to understand which Python classes represent database tables
class Base(DeclarativeBase):
    pass

# teh actual database table model
class EventRecord(Base):
    __tablename__ = "events"

    id: Mapped[int] = mapped_column(Integer, primary_key = True, index = True)
    source: Mapped[str] = mapped_column(String)
    category: Mapped[str] = mapped_column(String)
    title: Mapped[str] = mapped_column(String)
    message: Mapped[str] = mapped_column(String)
    location_name: Mapped[str] = mapped_column(String)
    latitude: Mapped[float] = mapped_column(Float)
    longitude: Mapped[float] = mapped_column(Float)
    timestamp: Mapped[str] = mapped_column(String)
    severity: Mapped[str] = mapped_column(String)
    status: Mapped[str] = mapped_column(String)

# need conversion functions for raw events and event record cause they have different jobs
# RawEvent is a pydantic model used for API input/output
# EventRecord is a model used for databse storage

def create_database_tables() -> None :
    Base.metadata.create_all(bind=engine)

def convert_record_to_raw_event(record: EventRecord) -> RawEvent:
    return RawEvent(
        id=record.id,
        source=record.source,
        category=record.category,
        title=record.title,
        message=record.message,
        location_name=record.location_name,
        latitude=record.latitude,
        longitude=record.longitude,
        timestamp=record.timestamp,
        severity=record.severity,
        status=record.status,
    )

def convert_raw_event_to_record(event: RawEvent) -> EventRecord:
    return EventRecord(
        id=event.id,
        source=event.source,
        category=event.category,
        title=event.title,
        message=event.message,
        location_name=event.location_name,
        latitude=event.latitude,
        longitude=event.longitude,
        timestamp=event.timestamp,
        severity=event.severity,
        status=event.status,
    )

# to chekc if database is empty
#if empty, we copy MOCK_EVENTS into database
def seed_initial_events_if_needed() -> None:
    with SessionLocal() as session:
        existing_event_count = session.query(EventRecord).count()

        if existing_event_count > 0:
            return

        for event in MOCK_EVENTS:
            session.add(convert_raw_event_to_record(event))

        session.commit()

# read all rows from database sorted by ID then convert each row to RawEvent
def get_all_events() -> list[RawEvent]:
    with SessionLocal() as session:
        records = session.query(EventRecord).order_by(EventRecord.id.asc()).all()

        return [convert_record_to_raw_event(record) for record in records]


def get_next_event_id() -> int:
    events = get_all_events()

    if not events:
        return 1

    return max(event.id for event in events) + 1

# save one new event into database
def save_event(event: RawEvent) -> RawEvent:
    with SessionLocal() as session:
        record = convert_raw_event_to_record(event)

        session.add(record)
        session.commit() # save change permanently
        session.refresh(record)

        return convert_record_to_raw_event(record)