from pydantic import BaseModel, EmailStr

from datetime import datetime
# ---------------- USER ----------------

class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    user_id: int
    full_name: str
    email: EmailStr
    resume_filename: str | None = None

    class Config:
        from_attributes = True


# ---------------- TOKEN ----------------

class Token(BaseModel):
    access_token: str
    token_type: str


# ---------------- INTERVIEW ----------------

class InterviewCreate(BaseModel):
    role: str
    difficulty: str


class InterviewResponse(BaseModel):
    session_id: int
    question_id: int
    question: str


# ---------------- QUESTIONS ----------------

class QuestionResponse(BaseModel):
    question_id: int
    question_text: str

    class Config:
        from_attributes = True


class InterviewQuestions(BaseModel):
    session_id: int
    questions: list[QuestionResponse]


# ---------------- ANSWERS ----------------

class AnswerCreate(BaseModel):
    session_id: int
    question_id: int
    answer_text: str


class AnswerResponse(BaseModel):
    completed: bool
    answer_id: int | None = None
    ai_score: float | None = None
    ai_feedback: str | None = None
    next_question_id: int | None = None
    next_question: str | None = None
    overall_score: float | None = None
    message: str | None = None

    class Config:
        from_attributes = True

    
class InterviewSummary(BaseModel):
    session_id: int
    overall_score: float
    total_questions: int

    class Config:
        from_attributes = True

class InterviewHistory(BaseModel):
    session_id: int
    role: str
    difficulty: str
    overall_score: float | None = None
    created_at: datetime

    class Config:
        from_attributes = True


class InterviewReportResponse(BaseModel):
    report_id: int
    session_id: int
    overall_score: float
    strengths: list[str]
    weak_topics: list[str]
    communication_rating: str
    confidence_rating: str
    technical_accuracy: str
    recommended_topics: list[str]
    suggestions: list[str]
    created_at: datetime

    class Config:
        from_attributes = True