from sqlalchemy import Float, Integer, String, Column, DateTime, Text
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime
from app.database import Base

#database table 
class EventRecord(Base):
    __tablename__ = "events"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
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

# to store saved AI analysis
class CachedIncidentAnalysisModel(Base):
    __tablename__ = "cached_incident_analyses"

    id = Column(Integer, primary_key=True, index=True)
    fingerprint = Column(String, unique=True, index=True, nullable=False)

    incident_id = Column(Integer, nullable=False)
    generated_summary = Column(Text, nullable=False)
    recommended_action = Column(Text, nullable=False)
    confidence_score = Column(Float, nullable=False)
    reasoning_notes_json = Column(Text, nullable=False)
    analysis_source = Column(String, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)