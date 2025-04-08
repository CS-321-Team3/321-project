#Project: JobSpanner
#Contributors: Toufeeq Sharieff
#Parsing of uploaded PDF

import pdfplumber
import re

def extract_text_from_pdf(pdf_path:str):
    """Extract text from a PDF file."""
    text = ""
    print(pdf_path)
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

# # Example using a sample resume
# pdf_path = "sample_resume.pdf"

# # Text is first extracted from the pdf
# resume_text = extract_text_from_pdf(pdf_path)

# # Skills are then extracted from the test
# skills_list = extract_skills_section(resume_text)


# print({"skills": skills_list})
