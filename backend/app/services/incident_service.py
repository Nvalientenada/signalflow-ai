from collections import Counter

from app.models import Incident, RawEvent, SeverityLevel


def get_highest_severity(events: list[RawEvent]) -> SeverityLevel:
    severity_rank = {
        "low": 1,
        "medium": 2,
        "high": 3,
    }

    highest_event = max(events, key=lambda event: severity_rank[event.severity])

    return highest_event.severity


def event_contains_any_keyword(event: RawEvent, keywords: list[str]) -> bool:
    searchable_text = (
        f"{event.title} {event.message} {event.location_name}"
    ).lower()

    return any(keyword in searchable_text for keyword in keywords)


def get_most_common_location(events: list[RawEvent], fallback: str) -> str:
    locations = [
        event.location_name
        for event in events
        if event.location_name.strip()
    ]

    if not locations:
        return fallback

    location_counts = Counter(locations)

    most_common_location = location_counts.most_common(1)[0][0]

    return most_common_location


def get_evidence_ids(events: list[RawEvent]) -> list[int]:
    return [event.id for event in events]


def build_weather_access_incident(
    events: list[RawEvent],
    incident_id: int,
) -> Incident | None:
    weather_access_keywords = [
        "rain",
        "storm",
        "snow",
        "ice",
        "wind",
        "flood",
        "flooding",
        "water",
        "water pooling",
        "shuttle",
        "delay",
        "delayed",
        "entrance",
        "gate",
        "access",
    ]

    related_events = [
        event
        for event in events
        if event.category in ["weather", "transportation", "user_report"]
        and event_contains_any_keyword(event, weather_access_keywords)
    ]

    if len(related_events) < 2:
        return None

    severity = get_highest_severity(related_events)
    affected_area = get_most_common_location(
        events=related_events,
        fallback="Campus Access Areas",
    )

    return Incident(
        id=incident_id,
        title="Weather or Access Disruption",
        summary=(
            "Multiple signals suggest that weather, flooding, transportation, "
            "or access conditions may be affecting campus movement."
        ),
        severity=severity,
        status="active",
        affected_area=affected_area,
        recommended_action=(
            "Monitor transportation and campus operations updates, avoid affected "
            "entrances or routes if possible, and notify students or staff about delays."
        ),
        evidence_event_ids=get_evidence_ids(related_events),
    )


def build_power_incident(
    events: list[RawEvent],
    incident_id: int,
) -> Incident | None:
    power_keywords = [
        "power",
        "outage",
        "power is out",
        "power out",
        "no power",
        "electricity",
        "electrical",
        "lights out",
        "no lights",
        "generator",
    ]

    related_events = [
        event
        for event in events
        if event.category == "power"
        or event_contains_any_keyword(event, power_keywords)
    ]

    if len(related_events) < 1:
        return None

    severity = get_highest_severity(related_events)
    affected_area = get_most_common_location(
        events=related_events,
        fallback="Campus Power Infrastructure",
    )

    return Incident(
        id=incident_id,
        title="Power Infrastructure Disruption",
        summary=(
            "Power-related signals indicate a possible electricity, lighting, "
            "or building power issue affecting campus operations."
        ),
        severity=severity,
        status="active",
        affected_area=affected_area,
        recommended_action=(
            "Confirm the outage with facilities staff, identify affected buildings, "
            "and communicate power availability or safety instructions to users."
        ),
        evidence_event_ids=get_evidence_ids(related_events),
    )


def build_network_incident(
    events: list[RawEvent],
    incident_id: int,
) -> Incident | None:
    network_keywords = [
        "wifi",
        "wi-fi",
        "internet",
        "network",
        "latency",
        "slow connection",
        "connection",
        "router",
        "unstable",
    ]

    related_events = [
        event
        for event in events
        if event.category == "network"
        or event_contains_any_keyword(event, network_keywords)
    ]

    if len(related_events) < 1:
        return None

    severity = get_highest_severity(related_events)
    affected_area = get_most_common_location(
        events=related_events,
        fallback="Campus Network Services",
    )

    return Incident(
        id=incident_id,
        title="Network Service Degradation",
        summary=(
            "Network-related signals suggest degraded connectivity, slow service, "
            "or unstable internet access in one or more campus areas."
        ),
        severity=severity,
        status="active",
        affected_area=affected_area,
        recommended_action=(
            "Check IT service status, verify whether the issue is localized or campus-wide, "
            "and notify users about expected connectivity impact."
        ),
        evidence_event_ids=get_evidence_ids(related_events),
    )


def build_building_safety_incident(
    events: list[RawEvent],
    incident_id: int,
) -> Incident | None:
    building_safety_keywords = [
        "fire",
        "fire drill",
        "alarm",
        "evacuation",
        "smoke",
        "blocked",
        "blocked entrance",
        "entrance is blocked",
        "blocked exit",
        "exit is blocked",
        "broken glass",
        "door",
        "hall",
        "building",
        "dorm",
    ]

    related_events = [
        event
        for event in events
        if event.category == "building"
        and event_contains_any_keyword(event, building_safety_keywords)
    ]

    if len(related_events) < 1:
        return None

    severity = get_highest_severity(related_events)
    affected_area = get_most_common_location(
        events=related_events,
        fallback="Campus Building",
    )

    return Incident(
        id=incident_id,
        title="Building or Safety Disruption",
        summary=(
            "Building-related signals suggest an access, safety, evacuation, "
            "or occupant awareness issue."
        ),
        severity=severity,
        status="active",
        affected_area=affected_area,
        recommended_action=(
            "Verify the report with campus operations or safety staff, notify affected "
            "occupants if needed, and monitor the situation until it is resolved."
        ),
        evidence_event_ids=get_evidence_ids(related_events),
    )


def generate_incidents(events: list[RawEvent]) -> list[Incident]:
    incidents: list[Incident] = []

    incident_builders = [
        build_weather_access_incident,
        build_power_incident,
        build_network_incident,
        build_building_safety_incident,
    ]

    for build_incident in incident_builders:
        incident = build_incident(
            events=events,
            incident_id=len(incidents) + 1,
        )

        if incident is not None:
            incidents.append(incident)

    return incidents