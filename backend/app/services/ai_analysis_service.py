from app.models import Incident, IncidentAnalysis, RawEvent
from app.settings import USE_LLM_ANALYSIS
from app.services.llm_analysis_service import analyze_incident_with_llm

def get_evidence_events_for_incident(
    incident: Incident,
    events: list[RawEvent],
) -> list[RawEvent]:
    return [
        event
        for event in events
        if event.id in incident.evidence_event_ids
    ]


def get_event_categories(events: list[RawEvent]) -> list[str]:
    categories = []

    for event in events:
        if event.category not in categories:
            categories.append(event.category)

    return categories


def get_highest_severity(events: list[RawEvent]) -> str:
    severity_rank = {
        "low": 1,
        "medium": 2,
        "high": 3,
    }

    if not events:
        return "low"

    highest_event = max(events, key=lambda event: severity_rank[event.severity])

    return highest_event.severity


def calculate_confidence_score(events: list[RawEvent]) -> float:
    evidence_count = len(events)

    if evidence_count >= 4:
        return 0.92

    if evidence_count == 3:
        return 0.84

    if evidence_count == 2:
        return 0.72

    if evidence_count == 1:
        return 0.58

    return 0.30


def build_summary_sentence(
    incident: Incident,
    evidence_events: list[RawEvent],
) -> str:
    evidence_count = len(evidence_events)
    categories = get_event_categories(evidence_events)
    highest_severity = get_highest_severity(evidence_events)

    if evidence_count == 0:
        return (
            f"{incident.title} was generated, but no supporting evidence events "
            "were found for this analysis."
        )

    category_text = ", ".join(categories)

    return (
        f"{incident.title} is supported by {evidence_count} signal"
        f"{'' if evidence_count == 1 else 's'} across {category_text}. "
        f"The highest observed severity is {highest_severity}, and the main "
        f"affected area is {incident.affected_area}."
    )


def build_recommended_action(
    incident: Incident,
    evidence_events: list[RawEvent],
) -> str:
    highest_severity = get_highest_severity(evidence_events)

    if highest_severity == "high":
        return (
            f"Prioritize verification for {incident.affected_area}, notify affected "
            "users quickly, and keep monitoring related signals until the situation "
            "is confirmed or resolved."
        )

    if highest_severity == "medium":
        return (
            f"Monitor {incident.affected_area}, confirm whether the issue is spreading, "
            "and prepare a targeted update for affected users if more signals appear."
        )

    return (
        f"Continue monitoring {incident.affected_area} and keep the incident open "
        "until there is enough evidence to confirm whether action is needed."
    )


def build_reasoning_notes(
    incident: Incident,
    evidence_events: list[RawEvent],
) -> list[str]:
    notes = []

    notes.append(
        f"The incident is linked to {len(evidence_events)} evidence event"
        f"{'' if len(evidence_events) == 1 else 's'}."
    )

    if evidence_events:
        highest_severity = get_highest_severity(evidence_events)
        notes.append(f"The highest evidence severity is {highest_severity}.")

        categories = get_event_categories(evidence_events)
        notes.append(
            "The supporting categories are: "
            + ", ".join(categories)
            + "."
        )

    notes.append(
        f"The affected area was identified as {incident.affected_area}."
    )

    return notes


def analyze_incident(
    incident: Incident,
    evidence_events: list[RawEvent],
) -> IncidentAnalysis:
    if USE_LLM_ANALYSIS:
        try:
            return analyze_incident_with_llm(
                incident=incident,
                evidence_events=evidence_events,
            )
        except Exception:
            pass

    generated_summary = build_summary_sentence(
        incident=incident,
        evidence_events=evidence_events,
    )

    recommended_action = build_recommended_action(
        incident=incident,
        evidence_events=evidence_events,
    )

    confidence_score = calculate_confidence_score(evidence_events)

    reasoning_notes = build_reasoning_notes(
        incident=incident,
        evidence_events=evidence_events,
    )

    return IncidentAnalysis(
        incident_id=incident.id,
        generated_summary=generated_summary,
        recommended_action=recommended_action,
        confidence_score=confidence_score,
        reasoning_notes=reasoning_notes,
        analysis_source = "local_fallback",
    )