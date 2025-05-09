#Project: JobSpanner
#Contributors: Toufeeq Sharieff, Ayesha Kazi
#Parsing of uploaded PDF

from io import BytesIO
import pdfplumber
import re
import boto3
from botocore.exceptions import NoCredentialsError, ClientError
from pymongo import MongoClient
from pymongo.server_api import ServerApi

def extract_text_from_pdf(pdf_path:bytes):
    """Extract text from a PDF file."""
    text = ""
    with BytesIO(pdf_path) as file:            
        with pdfplumber.open(file) as pdf:
            for page in pdf.pages:
                text += page.extract_text() + "\n"
    return text

def extract_skills_section(text):
    """Find the skills section and extract listed skills."""
    # Convert text to lowercase for case-insensitive search
    text = text.lower()

    # Regex to find the skills section (common variations: 'skills', 'technical skills', etc.)
    match = re.search(r"(skills|technical skills|key skills)[:\n]", text)

    if not match:
        return []  # Return empty list if no skills section found

    # Extract text after the "skills" heading
    start_idx = match.end()
    skills_text = text[start_idx:].strip()

    # Stop at next section heading (assume sections are separated by empty lines or new headings)
    skills_text = re.split(r"\n\s*\n|education|experience|projects|certifications", skills_text, maxsplit=1)[0]

    # Split skills based on common separators (comma, bullet points, new lines)
    skills = re.split(r"[,•\n]", skills_text)
    
    # Clean and normalize skills
    skills = [skill.strip() for skill in skills if skill.strip()]
    
    return skills

def s3_upload(path_to_file, name_of_file, bucket_name='jobspannerresumes', region='us-east-1'):
    """
    Upload a PDF file to a specified S3 bucket.

    :param path_to_file: Local path to the PDF file
    :param name_of_file: Desired filename (key) in the S3 bucket
    :param bucket_name: S3 bucket name (default: 'jobspannerresumes')
    :param region: AWS region of the S3 bucket (default: 'us-east-1')
    """
    s3 = boto3.client('s3', region_name=region)
    
    try:
        s3.upload_file(
            Filename=path_to_file,
            Bucket=bucket_name,
            Key=name_of_file,
            ExtraArgs={'ContentType': 'application/pdf'}
        )
        print(f"✅ Successfully uploaded {path_to_file} to s3://{bucket_name}/{name_of_file}")
    except FileNotFoundError:
        print("❌ Error: The file was not found.")
    except NoCredentialsError:
        print("❌ Error: AWS credentials not found. Run `aws configure`.")
    except ClientError as e:
        print(f"❌ AWS error: {e}")

def s3_list(bucket_name = 'jobspannerresumes', region='us-east-1'):
    """
    This function lists all of the resumes currently in the s3 bucket and when they were last modified.
    """
    s3 = boto3.client('s3', region_name=region)
    # List objects in the bucket
    response = s3.list_objects_v2(Bucket=bucket_name)

    # Check if the bucket has any objects
    if 'Contents' in response:
        # Print the file names (keys) in the bucket
        for obj in response['Contents']:
            print(f"File: {obj['Key']} - Last Modified: {obj['LastModified']}")
    else:
        print("No files found in the bucket.")

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

def fetch_jobs(query):
    uri = "mongodb+srv://AyeshaK:syDHLige6B6pXi1w@cluster0.w8q01.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    client = MongoClient(uri, server_api=ServerApi('1'))
    db = client["JobSpanner"]
    jobs_collection = db["jobs"]
    jobs = jobs_collection.find(query).to_list(10)

    for job in jobs:
        job['_id'] = str(job['_id'])
        
    return jobs

# Example using a sample resume
# pdf_path = "sample_resume.pdf"

# # Text is first extracted from the pdf
# resume_text = extract_text_from_pdf(pdf_path)

# # Skills are then extracted from the test
# skills_list = extract_skills_section(resume_text)

# s3_upload(pdf_path, "test_resume_IAM") #adds the pdf with the name "test_resume_IAM"
# s3_list() #lists all of the objects currently in the bucket

# print({"skills": skills_list})
