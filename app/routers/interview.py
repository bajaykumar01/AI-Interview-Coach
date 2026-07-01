from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
import io
from pypdf import PdfReader

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


@router.post("/upload-resume")
def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF resume uploads are supported."
        )

    try:
        file_bytes = file.file.read()
        reader = PdfReader(io.BytesIO(file_bytes))
        extracted_text = ""
        for page in reader.pages:
            text = page.extract_text()
            if text:
                extracted_text += text + "\n"

        if not extracted_text.strip():
            raise HTTPException(
                status_code=400,
                detail="Could not extract text from the PDF. Please check if it contains selectable text."
            )

        current_user.resume_filename = file.filename
        current_user.resume_text = extracted_text
        db.commit()
        db.refresh(current_user)

        return {
            "message": "Resume uploaded and text extracted successfully.",
            "filename": file.filename
        }

    except HTTPException as he:
        raise he
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while processing the PDF: {str(e)}"
        )


@router.get(
    "/report/{session_id}",
    response_model=schemas.InterviewReportResponse
)
def get_interview_report(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    report = crud.get_interview_report(db, session_id)
    if not report:
        raise HTTPException(
            status_code=404,
            detail="No AI report found for this interview session."
        )
    return report