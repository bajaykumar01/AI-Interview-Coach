from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text,Float
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database import Base

class User(Base):

    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)

    full_name = Column(String(100), nullable=False)

    email = Column(String(255), unique=True, nullable=False)

    password_hash = Column(String(255), nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)
    interviews = relationship(
    "InterviewSession",
    back_populates="user"
    )

class InterviewSession(Base):
    __tablename__ = "interview_sessions"

    session_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"))
    role = Column(String(100))
    difficulty = Column(String(20))
    overall_score = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    user = relationship("User", back_populates="interviews")
        
class Question(Base):

    __tablename__ = "questions"

    question_id = Column(Integer, primary_key=True, index=True)

    role = Column(String(50), nullable=False)

    difficulty = Column(String(20), nullable=False)

    question_number = Column(Integer, default=1)

    question_text = Column(Text, nullable=False)

    expected_keywords = Column(Text)

class Answer(Base):
    __tablename__ = "answers"

    answer_id = Column(Integer, primary_key=True, index=True)

    session_id = Column(
        Integer,
        ForeignKey("interview_sessions.session_id")
    )

    question_id = Column(
        Integer,
        ForeignKey("questions.question_id")
    )

    answer_text = Column(Text, nullable=False)

    ai_score = Column(Float, nullable=True)

    ai_feedback = Column(Text, nullable=True)

    submitted_at = Column(DateTime, default=datetime.utcnow)