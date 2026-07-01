from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from app.routers.auth import create_access_token
from app import models
from app import schemas
from app import crud
from app.database import engine, SessionLocal, get_db
from app.dependencies import get_current_user
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, interview

from sqlalchemy import text
models.Base.metadata.create_all(bind=engine)

# Safely migrate columns if table already exists
with engine.connect() as conn:
    try:
        conn.execute(text("ALTER TABLE users ADD COLUMN resume_filename VARCHAR(255) NULL"))
    except Exception:
        pass
    try:
        conn.execute(text("ALTER TABLE users ADD COLUMN resume_text TEXT NULL"))
    except Exception:
        pass
    try:
        conn.execute(text("ALTER TABLE interview_sessions MODIFY COLUMN overall_score FLOAT NULL"))
    except Exception:
        pass
    conn.commit()

app = FastAPI()

app.include_router(auth.router)
app.include_router(interview.router)

@app.get("/")
def home():
    return {
        "project": "AI Interview Coach",
        "developer": "Ajay",
        "version": "1.0"
    }

@app.get("/about")
def about():
    return {
        "message": "This project helps students practice interviews using AI."
    }

@app.get("/me", response_model=schemas.UserResponse)
def get_me(current_user: models.User = Depends(get_current_user)):
    return current_user
@app.post("/register", response_model=schemas.UserResponse)
def register(
    user: schemas.UserCreate,
    db: Session = Depends(get_db)
):

    return crud.create_user(db, user)
@app.post("/login", response_model=schemas.Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    db_user = crud.login_user(
        db,
        form_data.username,      # email goes here
        form_data.password
    )

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    access_token = create_access_token(
        data={"sub": db_user.email}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)