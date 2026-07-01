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

        # Call Gemini to extract profile metadata
        from app.gemini import extract_resume_profile
        import json
        try:
            profile_data = extract_resume_profile(extracted_text)
            current_user.resume_skills = json.dumps(profile_data["skills"])
            current_user.resume_summary = profile_data["summary"]
            current_user.resume_role = profile_data["recommended_role"]
        except Exception as ge:
            print("Gemini resume profiling failed:", str(ge))
            # Fallback values
            current_user.resume_skills = json.dumps(["Software Engineering"])
            current_user.resume_summary = "Candidate profile loaded successfully."
            current_user.resume_role = "Software Developer"

        db.commit()
        db.refresh(current_user)

        return {
            "message": "Resume uploaded and text extracted successfully.",
            "filename": file.filename,
            "resume_role": current_user.resume_role,
            "resume_summary": current_user.resume_summary,
            "resume_skills": current_user.resume_skills
        }

    except HTTPException as he:
        raise he
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while processing the PDF: {str(e)}"
        )


@router.get("/stats", response_model=dict)
def get_interview_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    sessions = (
        db.query(models.InterviewSession)
        .filter(
            models.InterviewSession.user_id == current_user.user_id,
            models.InterviewSession.overall_score.isnot(None)
        )
        .all()
    )

    total_interviews = len(sessions)

    if total_interviews > 0:
        average_score = sum(s.overall_score for s in sessions) / total_interviews
        best_score = max(s.overall_score for s in sessions)
    else:
        average_score = 0.0
        best_score = 0.0

    recent_sessions = (
        db.query(models.InterviewSession)
        .filter(
            models.InterviewSession.user_id == current_user.user_id,
            models.InterviewSession.overall_score.isnot(None)
        )
        .order_by(models.InterviewSession.created_at.asc())
        .all()
    )

    score_history = []
    for idx, s in enumerate(recent_sessions[-7:]):
        score_history.append({
            "name": f"Session {idx+1}",
            "score": round(s.overall_score, 1),
            "role": s.role
        })

    resume_based_count = (
        db.query(models.InterviewSession)
        .filter(
            models.InterviewSession.user_id == current_user.user_id,
            models.InterviewSession.is_resume_based == True
        )
        .count()
    )

    configured_count = (
        db.query(models.InterviewSession)
        .filter(
            models.InterviewSession.user_id == current_user.user_id,
            models.InterviewSession.is_resume_based == False
        )
        .count()
    )

    return {
        "total_interviews": total_interviews,
        "average_score": round(average_score, 1),
        "best_score": round(best_score, 1),
        "resume_uploaded": current_user.resume_filename is not None,
        "resume_filename": current_user.resume_filename,
        "resume_role": current_user.resume_role,
        "resume_skills": current_user.resume_skills,
        "resume_summary": current_user.resume_summary,
        "score_history": score_history,
        "mode_distribution": [
            {"name": "Resume-Based", "value": resume_based_count},
            {"name": "Configure Mode", "value": configured_count}
        ]
    }


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