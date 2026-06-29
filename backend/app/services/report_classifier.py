from app.models import EventCategory, SeverityLevel, UserReportCreate


def text_contains_any_keyword(text: str, keywords: list[str]) -> bool:
    normalized_text = text.lower()

    return any(keyword in normalized_text for keyword in keywords)


def classify_report_category(report: UserReportCreate) -> EventCategory:
    searchable_text = f"{report.message} {report.location_name}".lower()

    category_keywords: dict[EventCategory, list[str]] = {
        "power": [
            "power",
            "power outage",
            "power is out",
            "power out",
            "no power",
            "electricity",
            "lights out",
            "no lights",
            "generator",
            "electrical",
        ],
        "network": [
            "wifi",
            "wi-fi",
            "internet",
            "network",
            "latency",
            "slow connection",
            "connection",
            "router",
        ],
        "weather": [
            "rain",
            "storm",
            "snow",
            "ice",
            "wind",
            "flood",
            "flooding",
            "water pooling",
            "weather",
        ],
        "transportation": [
            "shuttle",
            "bus",
            "transport",
            "route",
            "delay",
            "delayed",
            "traffic",
            "pickup",
            "dropoff",
        ],
        "building": [
            "building",
            "hall",
            "dorm",
            "library",
            "entrance",
            "exit",
            "blocked",
            "fire drill",
            "alarm",
            "evacuation",
            "smoke",
            "broken glass",
            "door",
        ],
        "user_report": [],
    }

    for category, keywords in category_keywords.items():
        if category == "user_report":
            continue

        if text_contains_any_keyword(searchable_text, keywords):
            return category

    return "user_report"


def suggest_report_severity(report: UserReportCreate) -> SeverityLevel:
    searchable_text = f"{report.message} {report.location_name}".lower()

    high_keywords = [
        "fire",
        "smoke",
        "evacuation",
        "blocked entrance",
        "entrance is blocked",
        "blocked exit",
        "exit is blocked",
        "power outage",
        "power is out",
        "power out",
        "no power",
        "danger",
        "emergency",
        "flooding",
        "broken glass",
    ]

    medium_keywords = [
        "delay",
        "delayed",
        "water pooling",
        "alarm",
        "fire drill",
        "unstable",
        "slow",
        "not working",
        "issue",
    ]

    if text_contains_any_keyword(searchable_text, high_keywords):
        return "high"

    if text_contains_any_keyword(searchable_text, medium_keywords):
        return "medium"

    return report.severity


def build_report_title(report: UserReportCreate, category: EventCategory) -> str:
    category_titles = {
        "weather": "Weather Report",
        "transportation": "Transportation Report",
        "building": "Building Report",
        "power": "Power Report",
        "network": "Network Report",
        "user_report": "User Report",
    }

    base_title = category_titles[category]

    return f"{base_title}: {report.location_name}"