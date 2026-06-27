from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app import crud, schemas, models
router = APIRouter(
    prefix="/interview",
    tags=["Interview"]
)


# ---------------- START INTERVIEW ----------------

@router.post(
    "/start",
    response_model=schemas.InterviewResponse
)
def start_interview(
    interview: schemas.InterviewCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):

    return crud.create_interview(
        db=db,
        interview=interview,
        current_user=current_user
    )


# ---------------- GET QUESTIONS ----------------

@router.get(
    "/questions",
    response_model=schemas.InterviewQuestions
)
def get_questions(
    session_id: int,
    role: str,
    difficulty: str,
    db: Session = Depends(get_db)
):

    questions = crud.get_questions(
        db=db,
        role=role,
        difficulty=difficulty
    )

    return {
        "session_id": session_id,
        "questions": questions
    }


# ---------------- SUBMIT ANSWER ----------------

@router.post(
    "/answer",
    response_model=schemas.AnswerResponse
)
def submit_answer(
    answer: schemas.AnswerCreate,
    db: Session = Depends(get_db)
):

    return crud.submit_answer(
        db=db,
        answer=answer
    )
@router.put(
    "/finish/{session_id}",
    response_model=schemas.InterviewSummary
)
def finish_interview(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    result = crud.finish_interview(
        db=db,
        session_id=session_id
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="No answers found for this interview session."
        )

    return result
@router.get(
    "/history",
    response_model=list[schemas.InterviewHistory]
)
def interview_history(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return crud.get_interview_history(
        db,
        current_user
    )