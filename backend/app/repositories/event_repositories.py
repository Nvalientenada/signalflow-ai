from app.database import SessionLocal
from app.db_models import EventRecord
from app.models import RawEvent

### The repository is the part of teh backend that knows how to read/write a specific type of data


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

# reads all events from database
def get_all_events() -> list[RawEvent]:
    with SessionLocal() as session:
        records = session.query(EventRecord).order_by(EventRecord.id.asc()).all()

        return [convert_record_to_raw_event(record) for record in records]

# find next available event ID
def get_next_event_id() -> int:
    events = get_all_events()

    if not events:
        return 1

    return max(event.id for event in events) + 1

# Saves one event into database
def save_event(event: RawEvent) -> RawEvent:
    with SessionLocal() as session:
        record = convert_raw_event_to_record(event)

        session.add(record)
        session.commit()
        session.refresh(record)

        return convert_record_to_raw_event(record)

# counts how mnay events are currently stored 
def get_event_count() -> int:
    with SessionLocal() as session:
        return session.query(EventRecord).count()