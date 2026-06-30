import json 

from app.database import SessionLocal
from app.db_models import CachedIncidentAnalysisModel
from app.models import IncidentAnalysis

# if a specific analysis already exists, return it 
# otherwise, return None 
def get_cached_analysis(fingerprint: str) -> IncidentAnalysis | None: 
    db = SessionLocal()

    try: 
        cached_analysis = (
            db.query(CachedIncidentAnalysisModel)
            .filter(CachedIncidentAnalysisModel.fingerprint == fingerprint)
            .first()
        )

        if cached_analysis is None : 
            return None 
        return IncidentAnalysis (
            incident_id=cached_analysis.incident_id,
            generated_summary= cached_analysis.generated_summary,
            recommended_action=cached_analysis.recommended_action,
            confidence_score=cached_analysis.confidence_score,
            reasoning_notes=json.loads(cached_analysis.reasoning_notes_json), # turns back in Python list
            analysis_source=cached_analysis.analysis_source,
        )
    finally:
        db.close()

# save this new analysis in SQLite so I can reuse it later
def save_cached_analysis(
        fingerprint: str,
        analysis: IncidentAnalysis,
) -> IncidentAnalysis:
    db = SessionLocal()
    try : 
        cached_analysis = CachedIncidentAnalysisModel(
            fingerprint=fingerprint,
            incident_id=analysis.incident_id,
            generated_summary=analysis.generated_summary,
            recommended_action=analysis.recommended_action,
            confidence_score=analysis.confidence_score,
            reasoning_notes_json=json.dumps(analysis.reasoning_notes), # store as JSON cause SQLite does not naturally store Pyton lists
            analysis_source=analysis.analysis_source,
        )

        db.add(cached_analysis)
        db.commit()

        return analysis
    finally:
        db.close()

def delete_all_cached_analyses() -> None :
    db = SessionLocal()

    try:
        db.query(CachedIncidentAnalysisModel).delete()
        db.commit()
    finally:
        db.close()