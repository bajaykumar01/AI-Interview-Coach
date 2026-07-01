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
        interview.difficulty,
        resume_text=current_user.resume_text
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

    # If interview is completed (5 questions limit)
    if question.question_number >= 5:

        answers = db.query(models.Answer).filter(
            models.Answer.session_id == answer.session_id
        ).all()

        average_score = sum(
            a.ai_score for a in answers
        ) / len(answers)

        interview = db.query(models.InterviewSession).filter(
            models.InterviewSession.session_id == answer.session_id
        ).first()

        if interview:
            interview.overall_score = average_score
            db.commit()

        # Build QA history for report generation
        qa_history = []
        for ans in answers:
            q = db.query(models.Question).filter(models.Question.question_id == ans.question_id).first()
            qa_history.append({
                "question": q.question_text if q else "",
                "answer": ans.answer_text,
                "score": ans.ai_score,
                "feedback": ans.ai_feedback
            })

        # Generate detailed AI Report
        try:
            from app.gemini import generate_interview_report
            import json
            report_data = generate_interview_report(
                role=interview.role if interview else "General Developer",
                difficulty=interview.difficulty if interview else "Medium",
                QA_history=qa_history
            )

            new_report = models.InterviewReport(
                session_id=answer.session_id,
                overall_score=report_data["overall_score"],
                strengths=json.dumps(report_data["strengths"]),
                weak_topics=json.dumps(report_data["weak_topics"]),
                communication_rating=report_data["communication_rating"],
                confidence_rating=report_data["confidence_rating"],
                technical_accuracy=report_data["technical_accuracy"],
                recommended_topics=json.dumps(report_data["recommended_topics"]),
                suggestions=json.dumps(report_data["suggestions"])
            )
            db.add(new_report)
            db.commit()
        except Exception as e:
            print("Failed to generate AI Report:", str(e))
            # Fallback report if Gemini fails
            import json
            new_report = models.InterviewReport(
                session_id=answer.session_id,
                overall_score=average_score,
                strengths=json.dumps(["Demonstrated knowledge in technical topics"]),
                weak_topics=json.dumps(["Needs revision on specific questions"]),
                communication_rating="Good",
                confidence_rating="Moderate",
                technical_accuracy=f"{int(average_score * 10)}%",
                recommended_topics=json.dumps(["System Architecture", "Role-based topics"]),
                suggestions=json.dumps(["Practice answering clearly", "Elaborate with examples"])
            )
            db.add(new_report)
            db.commit()

        return {
            "completed": True,
            "overall_score": average_score,
            "message": "Interview Completed"
        }

    # Retrieve user resume for personalization
    session_obj = db.query(models.InterviewSession).filter(
        models.InterviewSession.session_id == answer.session_id
    ).first()
    user_obj = session_obj.user if session_obj else None
    resume_text = user_obj.resume_text if user_obj else None

    # Generate next question
    next_question = generate_next_question(
        role=question.role,
        difficulty=question.difficulty,
        previous_question=question.question_text,
        previous_answer=answer.answer_text,
        score=ai_result["score"],
        resume_text=resume_text
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


def finish_interview(db: Session, session_id: int):
    # Find all answers for this session
    answers = db.query(models.Answer).filter(
        models.Answer.session_id == session_id
    ).all()

    if not answers:
        return None

    average_score = sum(a.ai_score for a in answers) / len(answers)

    interview = db.query(models.InterviewSession).filter(
        models.InterviewSession.session_id == session_id
    ).first()

    if interview:
        interview.overall_score = average_score
        db.commit()

    return {
        "session_id": session_id,
        "overall_score": average_score,
        "total_questions": len(answers)
    }


def get_interview_report(db: Session, session_id: int):
    report = db.query(models.InterviewReport).filter(
        models.InterviewReport.session_id == session_id
    ).first()
    if not report:
        return None

    import json
    try:
        strengths_list = json.loads(report.strengths)
    except Exception:
        strengths_list = [report.strengths]

    try:
        weak_topics_list = json.loads(report.weak_topics)
    except Exception:
        weak_topics_list = [report.weak_topics]

    try:
        recommended_topics_list = json.loads(report.recommended_topics)
    except Exception:
        recommended_topics_list = [report.recommended_topics]

    try:
        suggestions_list = json.loads(report.suggestions)
    except Exception:
        suggestions_list = [report.suggestions]

    return {
        "report_id": report.report_id,
        "session_id": report.session_id,
        "overall_score": report.overall_score,
        "strengths": strengths_list,
        "weak_topics": weak_topics_list,
        "communication_rating": report.communication_rating,
        "confidence_rating": report.confidence_rating,
        "technical_accuracy": report.technical_accuracy,
        "recommended_topics": recommended_topics_list,
        "suggestions": suggestions_list,
        "created_at": report.created_at
    }