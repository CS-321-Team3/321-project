import pdfplumber
import re
import boto3
from botocore.exceptions import NoCredentialsError, ClientError
from pymongo import MongoClient
from pymongo.server_api import ServerApi

# --- PDF + Text Functions ---

def extract_text_from_pdf(pdf_path:str):
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() + "\n"
    return text

def extract_skills_section(text):
    text = text.lower()
    match = re.search(r"(skills|technical skills|key skills)[:\n]", text)
    if not match:
        return []
    start_idx = match.end()
    skills_text = text[start_idx:].strip()
    skills_text = re.split(r"\n\s*\n|education|experience|projects|certifications", skills_text, maxsplit=1)[0]
    skills = re.split(r"[,•\n]", skills_text)
    return [skill.strip() for skill in skills if skill.strip()]

def extract_email(text):
    match = re.search(r"[\w\.-]+@[\w\.-]+\.\w+", text)
    return match.group(0) if match else "Not found"

# --- S3 Upload ---

def s3_upload(path_to_file, name_of_file, bucket_name='jobspannerresumes', region='us-east-1'):
    s3 = boto3.client('s3', region_name=region)
    try:
        s3.upload_file(
            Filename=path_to_file,
            Bucket=bucket_name,
            Key=name_of_file,
            ExtraArgs={'ContentType': 'application/pdf'}
        )
        print(f"✅ Uploaded {path_to_file} to s3://{bucket_name}/{name_of_file}")
    except (FileNotFoundError, NoCredentialsError, ClientError) as e:
        print(f"❌ Upload error: {e}")

# --- MongoDB Insert ---

def insert_resume_to_mongodb(resume_data):
    uri = "mongodb+srv://AyeshaK:syDHLige6B6pXi1w@cluster0.w8q01.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    client = MongoClient(uri, server_api=ServerApi('1'))
    db = client["JobSpanner"]
    collection = db["resumes"]
    result = collection.insert_one(resume_data)
    try:
        print(f"✅ Inserted into MongoDB with ID: {result.inserted_id}")
    except Exception as e:
        print(f"❌ MongoDB insert error: {e}")

# --- Main Flow ---

# pdf_path = "sample_resume.pdf"
# resume_text = extract_text_from_pdf(pdf_path)
# skills = extract_skills_section(resume_text)
# email = extract_email(resume_text)

# resume_data = {
#     "email": email,
#     "skills": skills,
#     "raw_text": resume_text,
#     "filename": pdf_path
# }

# # Upload to S3
# s3_upload(pdf_path, "sample_resume.pdf")

# # Insert to MongoDB
# insert_resume_to_mongodb(resume_data)