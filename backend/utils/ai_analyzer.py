import json
import re
from typing import List, Dict, Any
from openai import OpenAI
import os
from dotenv import load_dotenv
from models import Resume, JobDescription
from schemas import ResumeAnalysis, JDAnalysis, MatchAnalysis

load_dotenv()

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class AIAnalyzer:
    def __init__(self):
        self.client = client
    
    async def analyze_resume_content(self, content: str) -> ResumeAnalysis:
        """Analyze resume content and extract structured information"""
        try:
            prompt = f"""
            Analyze the following resume content and extract structured information:
            
            Resume Content:
            {content}
            
            Please provide a JSON response with the following structure:
            {{
                "skills": ["skill1", "skill2", "skill3"],
                "experience_years": 5.5,
                "education": [
                    {{"degree": "Bachelor of Science", "field": "Computer Science", "institution": "University Name", "year": "2020"}}
                ],
                "summary": "A concise 2-3 sentence summary of the candidate's background and key qualifications"
            }}
            
            Extract skills from the resume, calculate total years of experience, identify education details, and create a professional summary.
            """
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3
            )
            
            result = json.loads(response.choices[0].message.content)
            return ResumeAnalysis(**result)
            
        except Exception as e:
            # Fallback analysis if AI fails
            return self._fallback_resume_analysis(content)
    
    async def analyze_jd_content(self, content: str) -> JDAnalysis:
        """Analyze job description content and extract structured information"""
        try:
            prompt = f"""
            Analyze the following job description and extract structured information:
            
            Job Description:
            {content}
            
            Please provide a JSON response with the following structure:
            {{
                "title": "Job Title",
                "company": "Company Name",
                "location": "Location",
                "required_skills": ["skill1", "skill2", "skill3"],
                "preferred_skills": ["skill1", "skill2"],
                "experience_required": 3.0,
                "education_required": "Bachelor's degree in Computer Science or related field"
            }}
            
            Extract the job title, company, location, required and preferred skills, years of experience required, and education requirements.
            """
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3
            )
            
            result = json.loads(response.choices[0].message.content)
            return JDAnalysis(**result)
            
        except Exception as e:
            # Fallback analysis if AI fails
            return self._fallback_jd_analysis(content)
    
    async def match_resume_jd(self, resume: Resume, jd: JobDescription) -> MatchAnalysis:
        """Match resume against job description and provide analysis"""
        try:
            resume_skills = json.loads(resume.skills) if resume.skills else []
            jd_required_skills = json.loads(jd.required_skills) if jd.required_skills else []
            jd_preferred_skills = json.loads(jd.preferred_skills) if jd.preferred_skills else []
            
            prompt = f"""
            Analyze the match between this resume and job description:
            
            Resume Summary: {resume.summary}
            Resume Skills: {resume_skills}
            Resume Experience: {resume.experience_years} years
            Resume Education: {resume.education}
            
            Job Title: {jd.title}
            Company: {jd.company}
            Required Skills: {jd_required_skills}
            Preferred Skills: {jd_preferred_skills}
            Experience Required: {jd.experience_required} years
            Education Required: {jd.education_required}
            
            Please provide a JSON response with the following structure:
            {{
                "overall_match": 85.5,
                "skills_match": 90.0,
                "experience_match": 80.0,
                "education_match": 95.0,
                "strengths": ["Strong technical skills", "Relevant experience"],
                "weaknesses": ["Missing some preferred skills", "Less experience than required"],
                "recommendations": ["Highlight relevant projects", "Emphasize transferable skills"],
                "feedback": "Overall strong match with good technical skills and relevant experience. Consider highlighting specific achievements that align with the job requirements."
            }}
            
            Calculate percentage matches for different aspects and provide constructive feedback.
            """
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3
            )
            
            result = json.loads(response.choices[0].message.content)
            return MatchAnalysis(**result)
            
        except Exception as e:
            # Fallback matching if AI fails
            return self._fallback_match_analysis(resume, jd)
    
    async def convert_to_jade_format(self, resume: Resume, jade_template: 'JadeTemplate') -> str:
        """Convert resume to Jade format using AI"""
        try:
            prompt = f"""
            Convert the following resume to Jade format using the provided template:
            
            Resume Content:
            {resume.content}
            
            Resume Summary:
            {resume.summary}
            
            Jade Template:
            {jade_template.content}
            
            Please convert the resume content to match the Jade format structure while preserving all important information from the original resume.
            """
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            # Fallback conversion if AI fails
            return self._fallback_jade_conversion(resume, jade_template)
    
    def _fallback_resume_analysis(self, content: str) -> ResumeAnalysis:
        """Fallback resume analysis using regex patterns"""
        # Extract skills using common patterns
        skills = []
        skill_patterns = [
            r'Python|Java|JavaScript|React|Node\.js|SQL|AWS|Docker|Kubernetes',
            r'Machine Learning|AI|Data Science|Analytics',
            r'Project Management|Leadership|Communication'
        ]
        
        for pattern in skill_patterns:
            matches = re.findall(pattern, content, re.IGNORECASE)
            skills.extend(matches)
        
        # Extract experience years
        exp_pattern = r'(\d+(?:\.\d+)?)\s*years?\s*(?:of\s*)?experience'
        exp_match = re.search(exp_pattern, content, re.IGNORECASE)
        experience_years = float(exp_match.group(1)) if exp_match else 0.0
        
        # Extract education
        education = []
        edu_pattern = r'(Bachelor|Master|PhD|B\.S\.|M\.S\.|Ph\.D\.).*?(?:in\s+)?([A-Za-z\s]+)'
        edu_matches = re.findall(edu_pattern, content, re.IGNORECASE)
        for degree, field in edu_matches:
            education.append({
                "degree": degree.strip(),
                "field": field.strip(),
                "institution": "Unknown",
                "year": "Unknown"
            })
        
        return ResumeAnalysis(
            skills=list(set(skills)),
            experience_years=experience_years,
            education=education,
            summary="Resume analysis completed with basic pattern matching."
        )
    
    def _fallback_jd_analysis(self, content: str) -> JDAnalysis:
        """Fallback JD analysis using regex patterns"""
        # Extract job title
        title_pattern = r'(?:position|role|job):\s*([A-Za-z\s]+)'
        title_match = re.search(title_pattern, content, re.IGNORECASE)
        title = title_match.group(1).strip() if title_match else "Unknown Position"
        
        # Extract company
        company_pattern = r'(?:company|organization):\s*([A-Za-z\s&.,]+)'
        company_match = re.search(company_pattern, content, re.IGNORECASE)
        company = company_match.group(1).strip() if company_match else "Unknown Company"
        
        # Extract location
        location_pattern = r'(?:location|based in):\s*([A-Za-z\s,]+)'
        location_match = re.search(location_pattern, content, re.IGNORECASE)
        location = location_match.group(1).strip() if location_match else "Unknown Location"
        
        # Extract required skills
        required_skills = []
        req_skill_patterns = [
            r'Python|Java|JavaScript|React|Node\.js|SQL|AWS|Docker|Kubernetes',
            r'Machine Learning|AI|Data Science|Analytics'
        ]
        
        for pattern in req_skill_patterns:
            matches = re.findall(pattern, content, re.IGNORECASE)
            required_skills.extend(matches)
        
        # Extract experience required
        exp_pattern = r'(\d+(?:\.\d+)?)\s*years?\s*(?:of\s*)?experience'
        exp_match = re.search(exp_pattern, content, re.IGNORECASE)
        experience_required = float(exp_match.group(1)) if exp_match else 0.0
        
        return JDAnalysis(
            title=title,
            company=company,
            location=location,
            required_skills=list(set(required_skills)),
            preferred_skills=[],
            experience_required=experience_required,
            education_required="Bachelor's degree preferred"
        )
    
    def _fallback_match_analysis(self, resume: Resume, jd: JobDescription) -> MatchAnalysis:
        """Fallback matching analysis"""
        resume_skills = json.loads(resume.skills) if resume.skills else []
        jd_required_skills = json.loads(jd.required_skills) if jd.required_skills else []
        
        # Calculate skills match
        common_skills = set(resume_skills) & set(jd_required_skills)
        skills_match = (len(common_skills) / len(jd_required_skills) * 100) if jd_required_skills else 0
        
        # Calculate experience match
        exp_match = 100 if resume.experience_years >= jd.experience_required else (resume.experience_years / jd.experience_required * 100) if jd.experience_required else 0
        
        # Calculate overall match
        overall_match = (skills_match + exp_match) / 2
        
        return MatchAnalysis(
            overall_match=overall_match,
            skills_match=skills_match,
            experience_match=exp_match,
            education_match=80.0,  # Default value
            strengths=["Relevant skills", "Good experience"] if overall_match > 70 else ["Some relevant background"],
            weaknesses=["Missing some skills", "Experience gap"] if overall_match < 80 else ["Minor skill gaps"],
            recommendations=["Highlight relevant experience", "Emphasize transferable skills"],
            feedback=f"Overall match: {overall_match:.1f}%. {'Strong candidate' if overall_match > 80 else 'Good candidate' if overall_match > 60 else 'Consider for interview'}."
        )
    
    def _fallback_jade_conversion(self, resume: Resume, jade_template: 'JadeTemplate') -> str:
        """Fallback Jade conversion"""
        return f"""
JADE FORMAT RESUME
==================

{resume.summary}

EXPERIENCE: {resume.experience_years} years
SKILLS: {resume.skills}
EDUCATION: {resume.education}

ORIGINAL CONTENT:
{resume.content}

Note: This is a basic conversion. For better formatting, please use the AI-powered conversion.
"""

# Create analyzer instance
ai_analyzer = AIAnalyzer()

# Export functions for use in services
async def analyze_resume_content(content: str) -> ResumeAnalysis:
    return await ai_analyzer.analyze_resume_content(content)

async def analyze_jd_content(content: str) -> JDAnalysis:
    return await ai_analyzer.analyze_jd_content(content)

async def match_resume_jd(resume: Resume, jd: JobDescription) -> MatchAnalysis:
    return await ai_analyzer.match_resume_jd(resume, jd)

async def convert_to_jade_format(resume: Resume, jade_template: 'JadeTemplate') -> str:
    return await ai_analyzer.convert_to_jade_format(resume, jade_template)


