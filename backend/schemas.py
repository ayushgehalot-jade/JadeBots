from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime

# User schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Resume schemas
class ResumeBase(BaseModel):
    filename: str
    original_filename: str

class ResumeCreate(ResumeBase):
    pass

class ResumeResponse(ResumeBase):
    id: int
    file_size: int
    content: str
    summary: Optional[str] = None
    skills: Optional[str] = None
    experience_years: Optional[float] = None
    education: Optional[str] = None
    jade_format: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    owner_id: int
    
    class Config:
        from_attributes = True

# Job Description schemas
class JDBase(BaseModel):
    filename: str
    original_filename: str

class JDCreate(JDBase):
    pass

class JDResponse(JDBase):
    id: int
    file_size: int
    content: str
    title: Optional[str] = None
    company: Optional[str] = None
    location: Optional[str] = None
    required_skills: Optional[str] = None
    preferred_skills: Optional[str] = None
    experience_required: Optional[float] = None
    education_required: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    owner_id: int
    
    class Config:
        from_attributes = True

# Match schemas
class MatchBase(BaseModel):
    resume_id: int
    jd_id: int

class MatchCreate(MatchBase):
    pass

class MatchResponse(MatchBase):
    id: int
    match_percentage: float
    skills_match: Optional[float] = None
    experience_match: Optional[float] = None
    education_match: Optional[float] = None
    overall_feedback: Optional[str] = None
    strengths: Optional[str] = None
    weaknesses: Optional[str] = None
    recommendations: Optional[str] = None
    created_at: datetime
    owner_id: int
    
    class Config:
        from_attributes = True

# Authentication schemas
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

# Jade Template schemas
class JadeTemplateBase(BaseModel):
    name: str
    description: Optional[str] = None

class JadeTemplateCreate(JadeTemplateBase):
    pass

class JadeTemplateResponse(JadeTemplateBase):
    id: int
    filename: str
    content: str
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    owner_id: int
    
    class Config:
        from_attributes = True

# Analysis schemas
class ResumeAnalysis(BaseModel):
    skills: List[str]
    experience_years: float
    education: List[Dict[str, Any]]
    summary: str

class JDAnalysis(BaseModel):
    title: str
    company: str
    location: str
    required_skills: List[str]
    preferred_skills: List[str]
    experience_required: float
    education_required: str

class MatchAnalysis(BaseModel):
    overall_match: float
    skills_match: float
    experience_match: float
    education_match: float
    strengths: List[str]
    weaknesses: List[str]
    recommendations: List[str]
    feedback: str


