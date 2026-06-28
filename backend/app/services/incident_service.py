from app.models import Incident, RawEvent, SeverityLevel

def get_highest_severity(events: list[RawEvent]) -> SeverityLevel :
    severity_rank = {
        "low": 1,
        "medium": 2,
        "high" : 3,
    }

    # find event with highest severity ranking
    highest_event = max(events, key=lambda event: severity_rank[event.severity])

    return highest_event.severity

def event_contains_any_keyword(event: RawEvent, keywords: list[str]) -> bool :
    message = event.message.lower()
    title = event.title.lower()
    location = event.location_name.lower()

    searchable_text = f"{title} {message} {location}"

    return any(keyword in searchable_text for keyword in keywords)


def get_common_affected_area(events:list[RawEvent], fallback: str) -> str: 
    if not events: 
        return fallback
    first_location = events[0].location_name 

    if first_location: 
        return first_location 
    return fallback


# finding weather events causing acces or transportation problems
def build_weather_access_incident(
    events: list[RawEvent],
    incident_id: int,
) -> Incident | None:
    keywords = [
        "rain",
        "flood",
        "water",
        "shuttle",
        "delay",
        "storm",
        "entrance",
        "gate",
    ]

    related_events = [
        event
        for event in events
        if event.category in ["weather", "transportation", "user_report"]
        and event_contains_any_keyword(event, keywords)
    ]

    if len(related_events) < 2:
        return None

    severity = get_highest_severity(related_events)

    return Incident(
        id=incident_id,
        title="Weather-Related Campus Access Disruption",
        summary=(
            "Multiple signals suggest that weather conditions may be affecting "
            "campus access, transportation, or pedestrian movement."
        ),
        severity=severity,
        status="active",
        affected_area="North Campus / Main Gate",
        recommended_action=(
            "Monitor transportation updates, avoid affected entrances if possible, "
            "and notify students or staff about potential delays."
        ),
        evidence_event_ids=[event.id for event in related_events],
    )

def build_power_facilities_incident(
    events: list[RawEvent],
    incident_id: int,
) -> Incident | None:
    keywords = [
        "power",
        "outage",
        "wi-fi",
        "wifi",
        "latency",
        "network",
        "electricity",
        "internet",
    ]

    related_events = [
        event
        for event in events
        if event.category in ["power", "building", "network", "user_report"]
        and event_contains_any_keyword(event, keywords)
    ]

    if len(related_events) < 1:
        return None

    severity = get_highest_severity(related_events)

    return Incident(
        id=incident_id,
        title="Facilities or Infrastructure Disruption",
        summary=(
            "One or more infrastructure-related signals indicate a possible issue "
            "with campus facilities, power, or network availability."
        ),
        severity=severity,
        status="active",
        affected_area="Campus Facilities",
        recommended_action=(
            "Check facilities and IT updates, confirm the affected building or service, "
            "and communicate expected impact to users."
        ),
        evidence_event_ids=[event.id for event in related_events],
    )


def build_building_safety_incident(
    events: list[RawEvent],
    incident_id: int,
) -> Incident | None:
    keywords = [
        "fire",
        "drill",
        "alarm",
        "evacuation",
        "smoke",
        "blocked",
        "broken glass",
        "building",
        "hall",
        "dorm",
        "library",
    ]

    related_events = [
        event
        for event in events
        if event.category in ["building", "user_report"]
        and event_contains_any_keyword(event, keywords)
    ]

    if len(related_events) < 1:
        return None

    severity = get_highest_severity(related_events)
    affected_area = get_common_affected_area(
        events=related_events,
        fallback="Campus Building",
    )

    return Incident(
        id=incident_id,
        title="Building or Safety-Related Campus Disruption",
        summary=(
            "One or more reports suggest a building-level or safety-related "
            "disruption that may affect access, movement, or occupant awareness."
        ),
        severity=severity,
        status="active",
        affected_area=affected_area,
        recommended_action=(
            "Verify the report with campus operations or safety staff, notify affected "
            "occupants if needed, and monitor the situation until it is resolved."
        ),
        evidence_event_ids=[event.id for event in related_events],
    )


def generate_incidents(events: list[RawEvent]) -> list[Incident]:
    incidents: list[Incident] = []

    weather_access_incident = build_weather_access_incident(
        events=events,
        incident_id=len(incidents) + 1,
    )

    if weather_access_incident is not None:
        incidents.append(weather_access_incident)

    power_facilities_incident = build_power_facilities_incident(
        events=events,
        incident_id=len(incidents) + 1,
    )

    if power_facilities_incident is not None:
        incidents.append(power_facilities_incident)

    building_safety_incident = build_building_safety_incident(
        events=events,
        incident_id=len(incidents) + 1,
    )

    if building_safety_incident is not None:
        incidents.append(building_safety_incident)

    return incidents