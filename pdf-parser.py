#Project: JobSpanner
#Contributors: Toufeeq Sharieff
#Parsing of uploaded PDF

import pdfplumber
import re
import boto3
from botocore.exceptions import NoCredentialsError, ClientError

def extract_text_from_pdf(pdf_path):
    """Extract text from a PDF file."""
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
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


# Example using a sample resume
pdf_path = "sample_resume.pdf"

# Text is first extracted from the pdf
resume_text = extract_text_from_pdf(pdf_path)

# Skills are then extracted from the test
skills_list = extract_skills_section(resume_text)

s3_upload(pdf_path, "test_resume")

print({"skills": skills_list})
