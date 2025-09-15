import os
import json
import uuid
from typing import List, Optional
from fastapi import HTTPException, UploadFile
from sqlalchemy.orm import Session
from models import Resume
from schemas import ResumeResponse, ResumeAnalysis
from utils.file_parser import parse_resume_file
from utils.ai_analyzer import analyze_resume_content

class ResumeService:
    def __init__(self):
        self.upload_dir = "uploads/resumes"
        os.makedirs(self.upload_dir, exist_ok=True)
    
    async def upload_resume(self, file: UploadFile, user_id: int, db: Session) -> ResumeResponse:
        """Upload and process a resume file"""
        try:
            # Validate file type
            if not file.filename.lower().endswith(('.pdf', '.doc', '.docx')):
                raise HTTPException(status_code=400, detail="Only PDF, DOC, and DOCX files are allowed")
            
            # Generate unique filename
            file_extension = os.path.splitext(file.filename)[1]
            unique_filename = f"{uuid.uuid4()}{file_extension}"
            file_path = os.path.join(self.upload_dir, unique_filename)
            
            # Save file
            with open(file_path, "wb") as buffer:
                content = await file.read()
                buffer.write(content)
            
            # Parse file content
            parsed_content = parse_resume_file(file_path)
            
            # Analyze content with AI
            analysis = await analyze_resume_content(parsed_content)
            
            # Create database record
            db_resume = Resume(
                filename=unique_filename,
                original_filename=file.filename,
                file_path=file_path,
                file_size=len(content),
                content=parsed_content,
                summary=analysis.summary,
                skills=json.dumps(analysis.skills),
                experience_years=analysis.experience_years,
                education=json.dumps(analysis.education),
                owner_id=user_id
            )
            
            db.add(db_resume)
            db.commit()
            db.refresh(db_resume)
            
            return ResumeResponse.from_orm(db_resume)
            
        except Exception as e:
            # Clean up file if database operation fails
            if 'file_path' in locals() and os.path.exists(file_path):
                os.remove(file_path)
            raise HTTPException(status_code=500, detail=f"Error processing resume: {str(e)}")
    
    async def get_user_resumes(self, user_id: int, db: Session) -> List[ResumeResponse]:
        """Get all resumes for a user"""
        resumes = db.query(Resume).filter(Resume.owner_id == user_id).all()
        return [ResumeResponse.from_orm(resume) for resume in resumes]
    
    async def get_resume(self, resume_id: int, user_id: int, db: Session) -> ResumeResponse:
        """Get a specific resume"""
        resume = db.query(Resume).filter(
            Resume.id == resume_id,
            Resume.owner_id == user_id
        ).first()
        
        if not resume:
            raise HTTPException(status_code=404, detail="Resume not found")
        
        return ResumeResponse.from_orm(resume)
    
    async def delete_resume(self, resume_id: int, user_id: int, db: Session) -> bool:
        """Delete a resume"""
        resume = db.query(Resume).filter(
            Resume.id == resume_id,
            Resume.owner_id == user_id
        ).first()
        
        if not resume:
            raise HTTPException(status_code=404, detail="Resume not found")
        
        # Delete file
        if os.path.exists(resume.file_path):
            os.remove(resume.file_path)
        
        # Delete from database
        db.delete(resume)
        db.commit()
        
        return True

# Create service instance
resume_service = ResumeService()


