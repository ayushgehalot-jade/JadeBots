import os
import PyPDF2
import docx
from typing import str

def parse_resume_file(file_path: str) -> str:
    """Parse resume file and extract text content"""
    file_extension = os.path.splitext(file_path)[1].lower()
    
    try:
        if file_extension == '.pdf':
            return parse_pdf(file_path)
        elif file_extension in ['.doc', '.docx']:
            return parse_docx(file_path)
        else:
            raise ValueError(f"Unsupported file format: {file_extension}")
    except Exception as e:
        raise Exception(f"Error parsing resume file: {str(e)}")

def parse_jd_file(file_path: str) -> str:
    """Parse job description file and extract text content"""
    file_extension = os.path.splitext(file_path)[1].lower()
    
    try:
        if file_extension == '.pdf':
            return parse_pdf(file_path)
        elif file_extension in ['.doc', '.docx']:
            return parse_docx(file_path)
        elif file_extension == '.txt':
            return parse_txt(file_path)
        else:
            raise ValueError(f"Unsupported file format: {file_extension}")
    except Exception as e:
        raise Exception(f"Error parsing job description file: {str(e)}")

def parse_pdf(file_path: str) -> str:
    """Extract text from PDF file"""
    text = ""
    with open(file_path, 'rb') as file:
        pdf_reader = PyPDF2.PdfReader(file)
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
    return text.strip()

def parse_docx(file_path: str) -> str:
    """Extract text from DOCX file"""
    doc = docx.Document(file_path)
    text = ""
    for paragraph in doc.paragraphs:
        text += paragraph.text + "\n"
    return text.strip()

def parse_txt(file_path: str) -> str:
    """Extract text from TXT file"""
    with open(file_path, 'r', encoding='utf-8') as file:
        return file.read().strip()


