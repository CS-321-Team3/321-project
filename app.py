from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pdfplumber
import re
import os
from typing import List
from pydantic import BaseModel

# Import functions from your existing code
from pdf_parser import extract_text_from_pdf, extract_skills_section

app = FastAPI(title="JobSpanner API")

# Configure CORS to allow requests from your React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Update with your React app's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SkillsResponse(BaseModel):
    skills: List[str]

@app.post("/extract-skills/", response_model=SkillsResponse)
async def extract_skills(file: UploadFile = File(...)):
    """
    Extract skills from an uploaded PDF resume.
    
    Parameters:
    - file: The PDF file uploaded from the frontend
    
    Returns:
    - A JSON object containing the extracted skills list
    """
    # Check if the uploaded file is a PDF
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Uploaded file must be a PDF")
    
    try:
               
        # Extract text from the PDF
        resume_text = extract_text_from_pdf(file)
        
        # Extract skills from the text
        skills_list = extract_skills_section(resume_text)
                
        # Return the skills list as JSON
        return {"skills": skills_list}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)