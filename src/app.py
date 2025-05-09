from fastapi import FastAPI, Form, UploadFile, File, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Annotated
from pydantic import BaseModel, Field
import sqlite3 as sql
import logging
from datetime import datetime
import re

# Import functions from your existing code
from pdf_parser import extract_text_from_pdf, extract_skills_section, insert_resume_to_mongodb, fetch_jobs

app = FastAPI(title="JobSpanner API", debug=True)

logger = logging.getLogger('uvicorn.error')
logger.setLevel(logging.DEBUG)
# Configure CORS to allow requests from React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # Update with working URL if you ever publish app, or React dev URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SkillsResponse(BaseModel):
    skills: List[str]

class Skill(BaseModel):
    skillname: str = Field(alias="Skill Name")
    skill_importance: int = Field(alias="Skill Importance")

class Job(BaseModel):
    id:                str = Field(alias="_id")
    jobname:           str
    job_description:   str
    skills:            List[Skill]
    technology_skills: List[str]

class JobsResponse(BaseModel):
    jobs: List[Job]

class UserAuth(BaseModel):
    username: str
    password: str

class SignUpForm(BaseModel):
    username: str
    password: str
    email:    str

class PasswordReset(BaseModel):
    found_username: bool
    username:       str
    password:       str | None

class JobQuery(BaseModel):
    query: str

db = sql.connect('../data/credentials.db')

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

@app.post('/signup/')
async def signup(data: Annotated[SignUpForm, Form()]):
    try:
        logger.debug(data)
        db.execute("INSERT INTO CREDENTIALS (UNAME, PWD, EMAIL) VALUES ((?), (?), (?))", [data.username, data.password, data.email]).fetchall()
        db.commit()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Exception: {e}");
    
    return {"status": 200}

@app.post('/password-reset/')
async def query(data: Annotated[PasswordReset, Request]):
    if data.found_username:
        if data.password is None:
            raise HTTPException(status_code=401, detail="Missing password");

        response = db.execute('UPDATE CREDENTIALS SET PWD=(?) WHERE UNAME=(?)', [data.password, data.username])
        db.commit()
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
async def extract_skills(file: Annotated[UploadFile, Form()]):
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
        contents = await file.read()
        # Extract text from the PDF
        resume_text = extract_text_from_pdf(contents)
        # Extract skills from the text
        skills_list = extract_skills_section(resume_text)

        try:
            insert_resume_to_mongodb(
                {
                    "file": datetime.now(),
                    "file": file.filename,
                    "extracted_data": skills_list
                }
            )
        except:
            logger.debug("some issue with adding to mongodb")

        # Return the skills list as JSON
        return {"skills": skills_list}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")

@app.post('/get-job-listings/', response_model=JobsResponse)
async def get_job_listings(jobquery: Annotated[JobQuery, Form()]):
    query = jobquery.query
    search_words = query.strip().split()
        
    # Create conditions for each word and each field
    word_conditions = []
    for word in search_words:
        pattern = re.compile(f".*{re.escape(word)}.*", re.IGNORECASE)
        
        word_conditions.append({"jobname": {"$regex": pattern}})
        word_conditions.append({"job_description": {"$regex": pattern}})
        word_conditions.append({"location": {"$regex": pattern}})

    # Combine with $or - matches if ANY condition is true
    query = {"$or": word_conditions}
    results = fetch_jobs(query)
    if results == None or len(results) == 0:
        logger.debug("wtf")
        raise HTTPException(status_code=500, detail="Something went wrong with the request. Please try again.")

    return {"jobs": results}


# @app.get('/get-schedule/')
# async def get_schedule(schedule_query):
#     return {}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)