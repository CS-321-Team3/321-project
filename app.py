from fastapi import FastAPI, Form, UploadFile, File, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Annotated
from pydantic import BaseModel
import sqlite3 as sql
import logging

# Import functions from your existing code
from pdf_parser import extract_text_from_pdf, extract_skills_section

app = FastAPI(title="JobSpanner API")

logger = logging.getLogger('uvicorn.error')
logger.setLevel(logging.DEBUG)
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

class UserAuth(BaseModel):
    username: str
    password: str

class PasswordReset(BaseModel):
    found_username: bool
    username:       str
    password:       str | None

db = sql.connect('credentials.db')

@app.post("/login/")
async def userauth(data: Annotated[UserAuth, Form()]):
    """
    Attempts to authenticate the user.
    Parameters:
        str: username
        str: password

    Returns:
        int: user id
    
    Throws:
        HTTPException if there is not exactly 1 user entry or if passwords don't match.
    """
    logger.debug(data)
    rows = db.execute("SELECT ID, PWD FROM CREDENTIALS WHERE UNAME=(?)", [data.username]).fetchall()
    logger.debug(rows)

    if len(rows) > 1:
        raise HTTPException(status_code=500, detail="Multiple entries for same username combos")
    if len(rows) < 1:
        raise HTTPException(status_code=401, detail="No matching users")
    if rows[0][1] != data.password:
        raise HTTPException(status_code=400, detail="Password does not match")
    
    return {"id":rows[0][0]}

@app.post('/password-reset/')
async def query(data: Annotated[PasswordReset, Request]):
    if data.found_username:
        if data.password is None:
            raise HTTPException(status_code=401, detail="Missing password");

        response = db.execute('UPDATE CREDENTIALS SET PWD=(?) WHERE UNAME=(?)', [data.password, data.username])

        return response
    else:
        if data.username is None or data.password is not None:
            raise HTTPException(status_code=401, detail="Either username is missing or password is not supposed to be there")
        
        rows = db.execute('SELECT UNAME FROM CREDENTIALS WHERE UNAME=(?)', [data.username]).fetchall()
        logger.debug(rows)
        if len(rows) > 1:
            raise HTTPException(status_code=500, detail="Multiple entries for same username combos")
        if len(rows) < 1:
            raise HTTPException(status_code=401, detail="No matching users")

        return rows[0][0]
    
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