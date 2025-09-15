import json
from typing import List, Optional
from fastapi import HTTPException
from sqlalchemy.orm import Session
from models import Resume, JobDescription, Match
from schemas import MatchResponse, MatchAnalysis
from utils.ai_analyzer import match_resume_jd

class MatchingService:
    def __init__(self):
        pass
    
    async def create_match(self, resume_id: int, jd_id: int, user_id: int, db: Session) -> MatchResponse:
        """Create a match between resume and job description"""
        try:
            # Get resume and JD
            resume = db.query(Resume).filter(
                Resume.id == resume_id,
                Resume.owner_id == user_id
            ).first()
            
            jd = db.query(JobDescription).filter(
                JobDescription.id == jd_id,
                JobDescription.owner_id == user_id
            ).first()
            
            if not resume:
                raise HTTPException(status_code=404, detail="Resume not found")
            
            if not jd:
                raise HTTPException(status_code=404, detail="Job description not found")
            
            # Perform AI matching analysis
            match_analysis = await match_resume_jd(resume, jd)
            
            # Create match record
            db_match = Match(
                resume_id=resume_id,
                jd_id=jd_id,
                owner_id=user_id,
                match_percentage=match_analysis.overall_match,
                skills_match=match_analysis.skills_match,
                experience_match=match_analysis.experience_match,
                education_match=match_analysis.education_match,
                overall_feedback=match_analysis.feedback,
                strengths=json.dumps(match_analysis.strengths),
                weaknesses=json.dumps(match_analysis.weaknesses),
                recommendations=json.dumps(match_analysis.recommendations)
            )
            
            db.add(db_match)
            db.commit()
            db.refresh(db_match)
            
            return MatchResponse.from_orm(db_match)
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error creating match: {str(e)}")
    
    async def get_user_matches(self, user_id: int, db: Session) -> List[MatchResponse]:
        """Get all matches for a user"""
        matches = db.query(Match).filter(Match.owner_id == user_id).all()
        return [MatchResponse.from_orm(match) for match in matches]
    
    async def get_match(self, match_id: int, user_id: int, db: Session) -> MatchResponse:
        """Get a specific match"""
        match = db.query(Match).filter(
            Match.id == match_id,
            Match.owner_id == user_id
        ).first()
        
        if not match:
            raise HTTPException(status_code=404, detail="Match not found")
        
        return MatchResponse.from_orm(match)
    
    async def delete_match(self, match_id: int, user_id: int, db: Session) -> bool:
        """Delete a match"""
        match = db.query(Match).filter(
            Match.id == match_id,
            Match.owner_id == user_id
        ).first()
        
        if not match:
            raise HTTPException(status_code=404, detail="Match not found")
        
        db.delete(match)
        db.commit()
        
        return True

# Create service instance
matching_service = MatchingService()


