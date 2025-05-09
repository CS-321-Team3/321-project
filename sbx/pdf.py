import fitz  # PyMuPDF pip install pymupdf
def main():
    
    #REPLACE WITH: every single skill that is searched for.
    skills_list = ["Python", "Java", "SQL", "JavaScript", "Machine Learning", "Data Analysis"]

    # Open and read the PDF
    doc = fitz.open("resume.pdf")
    full_text = ""

    for page in doc:
        full_text += page.get_text()

    # Normalize for case-insensitive matching
    text_lower = full_text.lower()
    found_skills = [skill for skill in skills_list if skill.lower() in text_lower]
    #found_skills is the list of skills found from the resume that match our skill database.
    print("Skills found in resume:", found_skills)
    


