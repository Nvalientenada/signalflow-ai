from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

DATABASE_URL = "sqlite:///./signalflow.db" # storing database in signalflow.db

# engine is teh connection btw Python and the database
engine= create_engine(
    DATABASE_URL,
    connect_args = {"check_same_thread": False}, # needed when using FastAPI
)

# a session is how we talk to a database 
# every time we need data, we create a session
SessionLocal = sessionmaker(
    bind= engine,
    autoflush= False,
    autocommit= False,
)

# class SQLAlchemy uses to understand which Python classes represent database tables
class Base(DeclarativeBase):
    pass


def create_database_tables() -> None :
    import app.db_models # to make sure SQLAlchemy loads EventRecord class before creating tables
    Base.metadata.create_all(bind=engine)

