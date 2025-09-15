from sqlalchemy import Column, Integer, String, Text, DateTime, Float, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    resumes = relationship("Resume", back_populates="owner")
    job_descriptions = relationship("JobDescription", back_populates="owner")
    matches = relationship("Match", back_populates="owner")

class Resume(Base):
    __tablename__ = "resumes"
    
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    original_filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    file_size = Column(Integer, nullable=False)
    content = Column(Text, nullable=False)
    summary = Column(Text, nullable=True)
    skills = Column(Text, nullable=True)  # JSON string of extracted skills
    experience_years = Column(Float, nullable=True)
    education = Column(Text, nullable=True)  # JSON string of education details
    jade_format = Column(Text, nullable=True)  # Jade formatted version
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Foreign keys
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Relationships
    owner = relationship("User", back_populates="resumes")
    matches = relationship("Match", back_populates="resume")

class JobDescription(Base):
    __tablename__ = "job_descriptions"
    
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    original_filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    file_size = Column(Integer, nullable=False)
    content = Column(Text, nullable=False)
    title = Column(String, nullable=True)
    company = Column(String, nullable=True)
    location = Column(String, nullable=True)
    required_skills = Column(Text, nullable=True)  # JSON string of required skills
    preferred_skills = Column(Text, nullable=True)  # JSON string of preferred skills
    experience_required = Column(Float, nullable=True)
    education_required = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Foreign keys
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Relationships
    owner = relationship("User", back_populates="job_descriptions")
    matches = relationship("Match", back_populates="job_description")

class Match(Base):
    __tablename__ = "matches"
    
    id = Column(Integer, primary_key=True, index=True)
    match_percentage = Column(Float, nullable=False)
    skills_match = Column(Float, nullable=True)
    experience_match = Column(Float, nullable=True)
    education_match = Column(Float, nullable=True)
    overall_feedback = Column(Text, nullable=True)
    strengths = Column(Text, nullable=True)  # JSON string of strengths
    weaknesses = Column(Text, nullable=True)  # JSON string of weaknesses
    recommendations = Column(Text, nullable=True)  # JSON string of recommendations
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Foreign keys
    resume_id = Column(Integer, ForeignKey("resumes.id"), nullable=False)
    jd_id = Column(Integer, ForeignKey("job_descriptions.id"), nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Relationships
    resume = relationship("Resume", back_populates="matches")
    job_description = relationship("JobDescription", back_populates="matches")
    owner = relationship("User", back_populates="matches")

class JadeTemplate(Base):
    __tablename__ = "jade_templates"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Foreign keys
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Relationships
    owner = relationship("User")


