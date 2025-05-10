#Project: JobSpanner
#Contributors: Sophia Denayer
#Fast api file

from fastapi import FastAPI
from fastapi import Query
from pydantic import BaseModel
from typing import List
from sorter import potential_jobs
from sorter import searched_words
from sorter import resume_skills
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

#sample 
@app.get("/potential_jobs/", response_model=List[dict])
@app.get("/potential_jobs/", response_model=List[dict])
def get_jobs():
    return [
        {
            "id": job_title,
            "title": job_title,
            "words": job_data["words"],
            "skills": job_data["skills"]
        }
        for job_title, job_data in potential_jobs.items()
    ]
    
@app.get("/searched_words/", response_model = List[dict])
def get_search():
    return searched_words;

@app.get("/resume_skills/", response_model = List[dict])
def get_skills():
    return resume_skills;

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
