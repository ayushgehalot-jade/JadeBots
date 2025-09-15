from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
import uvicorn
import os
from dotenv import load_dotenv

from database import get_db, engine, Base
from models import Resume, JobDescription, Match, User
from schemas import (
    ResumeCreate, ResumeResponse, JDCreate, JDResponse, 
    MatchResponse, UserCreate, UserResponse, LoginRequest
)
from services import (
    resume_service, jd_service, matching_service, 
    auth_service, jade_service
)

load_dotenv()

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Jade AI Resume Matching API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

# Dependency to get current user
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    return await auth_service.get_current_user(credentials.credentials, db)

# Authentication endpoints
@app.post("/auth/register", response_model=UserResponse)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    return await auth_service.register_user(user_data, db)

@app.post("/auth/login")
async def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    return await auth_service.login_user(login_data, db)

# Resume endpoints
@app.post("/resumes/upload", response_model=ResumeResponse)
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return await resume_service.upload_resume(file, current_user.id, db)

@app.get("/resumes", response_model=list[ResumeResponse])
async def get_resumes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return await resume_service.get_user_resumes(current_user.id, db)

@app.get("/resumes/{resume_id}", response_model=ResumeResponse)
async def get_resume(
    resume_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return await resume_service.get_resume(resume_id, current_user.id, db)

# Job Description endpoints
@app.post("/jds/upload", response_model=JDResponse)
async def upload_jd(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return await jd_service.upload_jd(file, current_user.id, db)

@app.get("/jds", response_model=list[JDResponse])
async def get_jds(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return await jd_service.get_user_jds(current_user.id, db)

@app.get("/jds/{jd_id}", response_model=JDResponse)
async def get_jd(
    jd_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return await jd_service.get_jd(jd_id, current_user.id, db)

# Matching endpoints
@app.post("/matches", response_model=MatchResponse)
async def create_match(
    resume_id: int = Form(...),
    jd_id: int = Form(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return await matching_service.create_match(resume_id, jd_id, current_user.id, db)

@app.get("/matches", response_model=list[MatchResponse])
async def get_matches(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return await matching_service.get_user_matches(current_user.id, db)

@app.get("/matches/{match_id}", response_model=MatchResponse)
async def get_match(
    match_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return await matching_service.get_match(match_id, current_user.id, db)

# Jade format endpoints
@app.post("/jade/convert/{resume_id}")
async def convert_to_jade(
    resume_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return await jade_service.convert_resume_to_jade(resume_id, current_user.id, db)

@app.post("/jade/upload")
async def upload_jade_template(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return await jade_service.upload_jade_template(file, current_user.id, db)

@app.get("/jade/templates")
async def get_jade_templates(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return await jade_service.get_jade_templates(current_user.id, db)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)


