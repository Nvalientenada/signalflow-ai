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

# finding weather events causing acces or transportation problems
def build_weather_access_incident(events: list[RawEvent], incident_id: int) -> Incident | None :
    related_events = [
        event 
        for event in events
        if event.category in ["weather", "transportation", "user_report"]
        and (
            "rain" in event.message.lower()
            or "flood" in event.message.lower()
            or "shuttle" in event.message.lower()
            or "delay" in event.message.lower()
        )
    ]

    if len(related_events) <2 : # need at least 2 events supporting incidents 
        return None 
    severity = get_highest_severity(related_events)

    return Incident(
        id = incident_id,
        title="Weather-related campus access disruption",
        summary=(
            "Multiple signals suggested that weather conditions may be affecting campus access,"
            "transportation, or pedestrian movement "
        ),
        severity=severity,
        status="active",
        affected_area="North Campus / Main Gate",
        recommended_action=(
            "Monitor transportation updates, avoid affected entrances if possible,"
            "and notify students or staff about potential delays"
        ),
        evidence_event_ids=[event.id for event in related_events], # store the ids of the raw events that were used as evidence
    )

def build_power_facilities_incident(events: list[RawEvent], incident_id: int) -> Incident | None:
    related_events = [
        event
        for event in events
        if event.category in ["power", "building", "network"]
        and (
            "power" in event.message.lower()
            or "outage" in event.message.lower()
            or "wi-fi" in event.message.lower()
            or "wifi" in event.message.lower()
            or "latency" in event.message.lower()
            or "building" in event.message.lower()
        )
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

def generate_incidents(events: list[RawEvent]) -> list[Incident]:
    incidents: list[Incident] = []

    weather_access_incident = build_weather_access_incident(
        events = events,
        incident_id=len(incidents) + 1,
    )

    if weather_access_incident is not None : 
        incidents.append(weather_access_incident)

    power_facilities_incident = build_power_facilities_incident(
        events=events,
        incident_id=len(incidents) + 1,
    )

    if power_facilities_incident is not None : 
        incidents.append(power_facilities_incident)

    return incidents
