import json

from openai import OpenAI

from app.models import Incident, IncidentAnalysis, RawEvent
from app.settings import OPENAI_API_KEY, OPENAI_MODEL


def build_llm_prompt(
    incident: Incident,
    evidence_events: list[RawEvent],
) -> str:
    evidence_payload = [
        {
            "id": event.id,
            "title": event.title,
            "category": event.category,
            "severity": event.severity,
            "location_name": event.location_name,
            "message": event.message,
            "source": event.source,
        }
        for event in evidence_events
    ]

    return f"""
You are an incident intelligence assistant for a campus operations dashboard.

Analyze the incident using only the provided incident and evidence events.
Do not invent facts.
Keep the response concise and operationally useful.

Incident:
{incident.model_dump_json()}

Evidence events:
{json.dumps(evidence_payload, indent=2)}

Return ONLY valid JSON with this exact shape:
{{
  "generated_summary": "string",
  "recommended_action": "string",
  "confidence_score": 0.0,
  "reasoning_notes": ["string", "string", "string"]
}}

Rules:
- confidence_score must be between 0 and 1.
- reasoning_notes should be short.
- recommended_action should be specific and practical.
- If evidence is weak, say that clearly.
""".strip()


def analyze_incident_with_llm(
    incident: Incident,
    evidence_events: list[RawEvent],
) -> IncidentAnalysis:
    if not OPENAI_API_KEY:
        raise ValueError("OPENAI_API_KEY is not configured.") # this is if no key exists

    client = OpenAI(api_key=OPENAI_API_KEY)

    prompt = build_llm_prompt(
        incident=incident,
        evidence_events=evidence_events,
    )

    response = client.chat.completions.create(
        model=OPENAI_MODEL,
        messages=[
            {
                "role": "system",
                "content": (
                    "You generate concise JSON incident analysis for an "
                    "operations dashboard. Return valid JSON only."
                ),
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],
        temperature=0.2,
    )

    content = response.choices[0].message.content

    if content is None:
        raise ValueError("The LLM returned an empty response.")

    parsed_response = json.loads(content)

    return IncidentAnalysis(
        incident_id=incident.id,
        generated_summary=parsed_response["generated_summary"],
        recommended_action=parsed_response["recommended_action"],
        confidence_score=float(parsed_response["confidence_score"]),
        reasoning_notes=parsed_response["reasoning_notes"],
    )