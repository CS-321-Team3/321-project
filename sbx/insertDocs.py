# Ayesha K
# insertDocs.py
import json
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

uri = "mongodb+srv://AyeshaK:syDHLige6B6pXi1w@cluster0.w8q01.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

db = client["JobSpanner"]
def insert_user_resume():
    users_collection = db["users"]  # Collection for users

    user_data = {
        "name": "Ayesha Kazi",
        "email": "ayesha@example.com",
        "resume": {
            "skills": ["Python", "Java", "MongoDB"],
            "education": [
                {
                    "degree": "BS Computer Science",
                    "school": "George Mason University",
                    "graduation_year": 2025
                }
            ],
            "experience": [
                {
                    "title": "Software Engineer Intern",
                    "company": "Exiger",
                    "duration": "Summer 2025",
                    "technologies": ["Java", "SQL", "MongoDB"]
                }
            ],
            "certifications": ["AWS Certified Developer"],
            "projects": [
                {
                    "name": "JobSpanner",
                    "description": "A resume gap-filler web app.",
                    "technologies": ["Python", "MongoDB", "React"]
                }
            ]
        },
        "career_goals": ["Software Engineer", "Full-Stack Developer"],
        "preferred_learning_methods": ["Online Courses", "Bootcamps"],
        "interview_prep": {
            "status": "Started",
            "mock_interviews_taken": 2
        }
    }
    # Insert into MongoDB
    inserted_id = users_collection.insert_one(user_data).inserted_id
    print(f"User Resume Inserted with ID: {inserted_id}")

# Run the function
insert_user_resume()

def insert_job_listing():
    jobs_collection = db["jobs"]  # Collection for job listings

    with open("jobs_with_skills.json", "r") as file:
        job_data = json.load(file)  # should be a list of dicts

    if isinstance(job_data, list):
        result = jobs_collection.insert_many(job_data)
        print(f"Inserted {len(result.inserted_ids)} job records.")
    else:
        print("Error: job_data is not a list.")

# Run the function
insert_job_listing()

def fetch_users():
    users_collection = db["users"]
    for user in users_collection.find():
        print(user)

def fetch_jobs():
    jobs_collection = db["jobs"]
    for job in jobs_collection.find():
        print(job)

# Call functions
fetch_users()
#fetch_jobs()
