import os
import json
import uuid
from typing import List, Optional
from fastapi import HTTPException, UploadFile
from sqlalchemy.orm import Session
from models import JobDescription
from schemas import JDResponse, JDAnalysis
from utils.file_parser import parse_jd_file
from utils.ai_analyzer import analyze_jd_content

class JDService:
    def __init__(self):
        self.upload_dir = "uploads/jds"
        os.makedirs(self.upload_dir, exist_ok=True)
    
    async def upload_jd(self, file: UploadFile, user_id: int, db: Session) -> JDResponse:
        """Upload and process a job description file"""
        try:
            # Validate file type
            if not file.filename.lower().endswith(('.pdf', '.doc', '.docx', '.txt')):
                raise HTTPException(status_code=400, detail="Only PDF, DOC, DOCX, and TXT files are allowed")
            
            # Generate unique filename
            file_extension = os.path.splitext(file.filename)[1]
            unique_filename = f"{uuid.uuid4()}{file_extension}"
            file_path = os.path.join(self.upload_dir, unique_filename)
            
            # Save file
            with open(file_path, "wb") as buffer:
                content = await file.read()
                buffer.write(content)
            
            # Parse file content
            parsed_content = parse_jd_file(file_path)
            
            # Analyze content with AI
            analysis = await analyze_jd_content(parsed_content)
            
            # Create database record
            db_jd = JobDescription(
                filename=unique_filename,
                original_filename=file.filename,
                file_path=file_path,
                file_size=len(content),
                content=parsed_content,
                title=analysis.title,
                company=analysis.company,
                location=analysis.location,
                required_skills=json.dumps(analysis.required_skills),
                preferred_skills=json.dumps(analysis.preferred_skills),
                experience_required=analysis.experience_required,
                education_required=analysis.education_required,
                owner_id=user_id
            )
            
            db.add(db_jd)
            db.commit()
            db.refresh(db_jd)
            
            return JDResponse.from_orm(db_jd)
            
        except Exception as e:
            # Clean up file if database operation fails
            if 'file_path' in locals() and os.path.exists(file_path):
                os.remove(file_path)
            raise HTTPException(status_code=500, detail=f"Error processing job description: {str(e)}")
    
    async def get_user_jds(self, user_id: int, db: Session) -> List[JDResponse]:
        """Get all job descriptions for a user"""
        jds = db.query(JobDescription).filter(JobDescription.owner_id == user_id).all()
        return [JDResponse.from_orm(jd) for jd in jds]
    
    async def get_jd(self, jd_id: int, user_id: int, db: Session) -> JDResponse:
        """Get a specific job description"""
        jd = db.query(JobDescription).filter(
            JobDescription.id == jd_id,
            JobDescription.owner_id == user_id
        ).first()
        
        if not jd:
            raise HTTPException(status_code=404, detail="Job description not found")
        
        return JDResponse.from_orm(jd)
    
    async def delete_jd(self, jd_id: int, user_id: int, db: Session) -> bool:
        """Delete a job description"""
        jd = db.query(JobDescription).filter(
            JobDescription.id == jd_id,
            JobDescription.owner_id == user_id
        ).first()
        
        if not jd:
            raise HTTPException(status_code=404, detail="Job description not found")
        
        # Delete file
        if os.path.exists(jd.file_path):
            os.remove(jd.file_path)
        
        # Delete from database
        db.delete(jd)
        db.commit()
        
        return True

# Create service instance
jd_service = JDService()


