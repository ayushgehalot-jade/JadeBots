import os
import json
import uuid
from typing import List, Optional
from fastapi import HTTPException, UploadFile
from sqlalchemy.orm import Session
from models import Resume, JadeTemplate
from schemas import JadeTemplateResponse
from utils.ai_analyzer import convert_to_jade_format

class JadeService:
    def __init__(self):
        self.upload_dir = "uploads/jade_templates"
        os.makedirs(self.upload_dir, exist_ok=True)
    
    async def convert_resume_to_jade(self, resume_id: int, user_id: int, db: Session) -> dict:
        """Convert a resume to Jade format"""
        try:
            # Get resume
            resume = db.query(Resume).filter(
                Resume.id == resume_id,
                Resume.owner_id == user_id
            ).first()
            
            if not resume:
                raise HTTPException(status_code=404, detail="Resume not found")
            
            # Get active Jade template
            jade_template = db.query(JadeTemplate).filter(
                JadeTemplate.owner_id == user_id,
                JadeTemplate.is_active == True
            ).first()
            
            if not jade_template:
                raise HTTPException(status_code=404, detail="No active Jade template found")
            
            # Convert resume to Jade format using AI
            jade_formatted = await convert_to_jade_format(resume, jade_template)
            
            # Update resume with Jade format
            resume.jade_format = jade_formatted
            db.commit()
            
            return {
                "resume_id": resume_id,
                "jade_format": jade_formatted,
                "template_used": jade_template.name,
                "conversion_successful": True
            }
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error converting to Jade format: {str(e)}")
    
    async def upload_jade_template(self, file: UploadFile, user_id: int, db: Session) -> JadeTemplateResponse:
        """Upload a Jade template"""
        try:
            # Validate file type
            if not file.filename.lower().endswith(('.txt', '.md', '.json')):
                raise HTTPException(status_code=400, detail="Only TXT, MD, and JSON files are allowed for Jade templates")
            
            # Generate unique filename
            file_extension = os.path.splitext(file.filename)[1]
            unique_filename = f"{uuid.uuid4()}{file_extension}"
            file_path = os.path.join(self.upload_dir, unique_filename)
            
            # Save file
            with open(file_path, "wb") as buffer:
                content = await file.read()
                buffer.write(content)
            
            # Read content
            with open(file_path, "r", encoding="utf-8") as f:
                template_content = f.read()
            
            # Create database record
            db_template = JadeTemplate(
                name=file.filename,
                filename=unique_filename,
                file_path=file_path,
                content=template_content,
                description=f"Jade template uploaded from {file.filename}",
                owner_id=user_id
            )
            
            db.add(db_template)
            db.commit()
            db.refresh(db_template)
            
            return JadeTemplateResponse.from_orm(db_template)
            
        except Exception as e:
            # Clean up file if database operation fails
            if 'file_path' in locals() and os.path.exists(file_path):
                os.remove(file_path)
            raise HTTPException(status_code=500, detail=f"Error processing Jade template: {str(e)}")
    
    async def get_jade_templates(self, user_id: int, db: Session) -> List[JadeTemplateResponse]:
        """Get all Jade templates for a user"""
        templates = db.query(JadeTemplate).filter(JadeTemplate.owner_id == user_id).all()
        return [JadeTemplateResponse.from_orm(template) for template in templates]
    
    async def set_active_template(self, template_id: int, user_id: int, db: Session) -> bool:
        """Set a Jade template as active"""
        # Deactivate all templates for user
        db.query(JadeTemplate).filter(JadeTemplate.owner_id == user_id).update({"is_active": False})
        
        # Activate selected template
        template = db.query(JadeTemplate).filter(
            JadeTemplate.id == template_id,
            JadeTemplate.owner_id == user_id
        ).first()
        
        if not template:
            raise HTTPException(status_code=404, detail="Jade template not found")
        
        template.is_active = True
        db.commit()
        
        return True
    
    async def delete_jade_template(self, template_id: int, user_id: int, db: Session) -> bool:
        """Delete a Jade template"""
        template = db.query(JadeTemplate).filter(
            JadeTemplate.id == template_id,
            JadeTemplate.owner_id == user_id
        ).first()
        
        if not template:
            raise HTTPException(status_code=404, detail="Jade template not found")
        
        # Delete file
        if os.path.exists(template.file_path):
            os.remove(template.file_path)
        
        # Delete from database
        db.delete(template)
        db.commit()
        
        return True

# Create service instance
jade_service = JadeService()


