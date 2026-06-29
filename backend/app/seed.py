from app.mock_data import MOCK_EVENTS
from app.repositories.event_repositories import get_event_count, save_event


def seed_initial_events_if_needed() -> None:
    existing_event_count = get_event_count() # chekc if there's already data

    if existing_event_count > 0:
        return

    for event in MOCK_EVENTS:
        save_event(event) # saves starter events