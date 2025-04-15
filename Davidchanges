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

