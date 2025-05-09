from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

#Add jobs to database
def data_jobs_add(jobname, words, skills):
    client = MongoClient("mongodb+srv://test:test@cluster0.ftlnm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    db = client["Stored_Data"]
    collection = db["Potential_Jobs"]
    
    document = {
        "jobname": jobname,
        "words": words, 
        "skills": skills
    }
#Get jobs from database
def data_jobs_get(searchterm):
    client = MongoClient("mongodb+srv://test:test@cluster0.ftlnm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    db = client["Stored_Data"]
    collection = db["Potential_Jobs"]
    query = {"text": {"$regex": searchterm, "$options": "i"}}  # Case-insensitive search
    result = collection.find(query)
    return result

def add_jobs_to_db():
    uri = "mongodb+srv://AyeshaK:syDHLige6B6pXi1w@cluster0.w8q01.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    client = MongoClient(uri, server_api=ServerApi('1'))
    db = client["JobSpanner"]
    collection = db["jobs"]
    import json
    with open("../data/jobs_with_skills.json", 'r') as f:
        jobs = json.load(f)
    result = collection.insert_many(jobs)
    print(f'inserted {result.inserted_ids} objects')

def fetch_jobs(query):
    uri = "mongodb+srv://AyeshaK:syDHLige6B6pXi1w@cluster0.w8q01.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    client = MongoClient(uri, server_api=ServerApi('1'))
    db = client["JobSpanner"]
    jobs_collection = db["jobs"]
    jobs = jobs_collection.find(query)
    
    return jobs.to_list(1)

# import re

# query_str = "Aerospace"
# search_words = query_str.strip().split()
    
# # Create conditions for each word and each field
# word_conditions = []
# for word in search_words:
#     pattern = re.compile(f".*{re.escape(word)}.*", re.IGNORECASE)
    
#     word_conditions.append({"jobname": {"$regex": pattern}})
#     word_conditions.append({"position": {"$regex": pattern}})
#     word_conditions.append({"location": {"$regex": pattern}})

# # Combine with $or - matches if ANY condition is true
# query = {"$or": word_conditions}

# results = fetch_jobs(query)

# for result in results:
#     result['_id'] = str(result['_id'])

# print(type(results[0]['_id']))