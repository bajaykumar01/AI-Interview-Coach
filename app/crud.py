from sqlalchemy.orm import Session
from fastapi import HTTPException

from app import models, schemas
from app.security import hash_password, verify_password
from app.gemini import (
    evaluate_answer,
    generate_question,
    generate_next_question
)

def create_user(db: Session, user: schemas.UserCreate):

    hashed_password = hash_password(user.password)

    new_user = models.User(
        full_name=user.full_name,
        email=user.email,
        password_hash=hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user
def login_user(db, email, password):

    user = db.query(models.User).filter(
        models.User.email == email
    ).first()

    if not user:
        return None

    if not verify_password(
        password,
        user.password_hash
    ):
        return None

    return user
def create_interview(
    db: Session,
    interview: schemas.InterviewCreate,
    current_user: models.User
):
    # Create interview session
    new_session = models.InterviewSession(
        user_id=current_user.user_id,
        role=interview.role,
        difficulty=interview.difficulty
    )

    db.add(new_session)
    db.commit()
    db.refresh(new_session)

    # Generate first question using Gemini
    question_text = generate_question(
        interview.role,
        interview.difficulty
    )

    # Save generated question
    question = models.Question(
        role=interview.role,
        difficulty=interview.difficulty,
        question_number=1,
        question_text=question_text,
        expected_keywords=None
    )

    db.add(question)
    db.commit()
    db.refresh(question)

    return {
        "session_id": new_session.session_id,
        "question_id": question.question_id,
        "question": question.question_text
    }
def get_questions(
    db: Session,
    role: str,
    difficulty: str
):
    questions = (
        db.query(models.Question)
        .filter(
            models.Question.role == role,
            models.Question.difficulty == difficulty
        )
        .all()
    )

    return questions
def submit_answer(
    db: Session,
    answer: schemas.AnswerCreate
):
    # Get current question
    question = db.query(models.Question).filter(
        models.Question.question_id == answer.question_id
    ).first()

    if not question:
        raise HTTPException(
            status_code=404,
            detail="Question not found"
        )

    # AI Evaluation
    ai_result = evaluate_answer(
        question.question_text,
        answer.answer_text
    )

    # Save answer
    new_answer = models.Answer(
        session_id=answer.session_id,
        question_id=answer.question_id,
        answer_text=answer.answer_text,
        ai_score=ai_result["score"],
        ai_feedback=ai_result["feedback"]
    )

    db.add(new_answer)
    db.commit()
    db.refresh(new_answer)

    # If interview is completed (5 questions)
    if question.question_number >= 2:

        answers = db.query(models.Answer).filter(
            models.Answer.session_id == answer.session_id
        ).all()

        average_score = sum(
            a.ai_score for a in answers
        ) / len(answers)

        interview = db.query(models.InterviewSession).filter(
            models.InterviewSession.session_id == answer.session_id
        ).first()

        interview.overall_score = average_score

        db.commit()

        return {
            "completed": True,
            "overall_score": average_score,
            "message": "Interview Completed"
        }

    # Generate next question
    next_question = generate_next_question(
        role=question.role,
        difficulty=question.difficulty,
        previous_question=question.question_text,
        previous_answer=answer.answer_text,
        score=ai_result["score"]
    )

    generated_question = models.Question(
        role=question.role,
        difficulty=question.difficulty,
        question_number=question.question_number + 1,
        question_text=next_question,
        expected_keywords=None
    )

    db.add(generated_question)
    db.commit()
    db.refresh(generated_question)

    return {
        "completed": False,
        "answer_id": new_answer.answer_id,
        "ai_score": ai_result["score"],
        "ai_feedback": ai_result["feedback"],
        "next_question_id": generated_question.question_id,
        "next_question": generated_question.question_text
    }
def get_questions(
    db: Session,
    role: str,  
    difficulty: str
):
    questions = db.query(models.Question).filter(
        models.Question.role == role,
        models.Question.difficulty == difficulty
    ).all()

    return questions

def get_interview_history(
    db: Session,
    current_user: models.User
):
    return (
        db.query(models.InterviewSession)
        .filter(
            models.InterviewSession.user_id == current_user.user_id
        )
        .order_by(
            models.InterviewSession.created_at.desc()
        )
        .all()
    )