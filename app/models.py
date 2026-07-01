from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Float, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database import Base

class User(Base):

    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)

    full_name = Column(String(100), nullable=False)

    email = Column(String(255), unique=True, nullable=False)

    password_hash = Column(String(255), nullable=False)

    resume_filename = Column(String(255), nullable=True)
    resume_text = Column(Text, nullable=True)
    resume_skills = Column(Text, nullable=True)  # JSON serialized list
    resume_summary = Column(Text, nullable=True) # Text summary
    resume_role = Column(String(255), nullable=True)   # Extracted job role

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
    overall_score = Column(Float, nullable=True)
    is_resume_based = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    user = relationship("User", back_populates="interviews")
    report = relationship("InterviewReport", back_populates="session", uselist=False, cascade="all, delete-orphan")
        
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

class InterviewReport(Base):
    __tablename__ = "interview_reports"

    report_id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("interview_sessions.session_id"), unique=True)
    overall_score = Column(Float, nullable=False)
    strengths = Column(Text, nullable=False)            # Stored as JSON string or comma-separated text
    weak_topics = Column(Text, nullable=False)          # Stored as JSON string or comma-separated text
    communication_rating = Column(String(100), nullable=False)
    confidence_rating = Column(String(100), nullable=False)
    technical_accuracy = Column(String(100), nullable=False)
    recommended_topics = Column(Text, nullable=False)   # Stored as JSON string or comma-separated text
    suggestions = Column(Text, nullable=False)          # Stored as JSON string or comma-separated text
    created_at = Column(DateTime, default=datetime.utcnow)

    session = relationship("InterviewSession", back_populates="report")