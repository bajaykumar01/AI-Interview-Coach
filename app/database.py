from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = "mysql+pymysql://root:ajay%401234@localhost/ai_interview_coach"

engine = create_engine(DATABASE_URL,echo=True)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()
def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()