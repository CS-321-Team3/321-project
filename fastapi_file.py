#Project: JobSpanner
#Contributors: Sophia Denayer
#Fast api file

from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from sorter import potential_jobs
from sorter import searched_words
from sorter import resume_skills
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

#sample 
@app.get("/potential_jobs/", response_model = List[dict])
def get_jobs():
    return potential_jobs;
    
@app.get("/searched_words/", response_model = List[dict])
def get_search():
    return searched_words;

@app.get("/resume_skills/", response_model = List[dict])
def get_skills():
    return resume_skills;

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or specify "http://localhost:3000"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
