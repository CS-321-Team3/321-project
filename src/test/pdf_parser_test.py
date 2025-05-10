import unittest
from pdf_parser import extract_skills_section

class TestSkillExtraction(unittest.TestCase):

    def test_extract_skills_valid(self):
        text = """
        Experience
        Comapany Test Company

        Skills: 
        Python, Java, SQL
        """
        expected = ["python", "java", "sql"]
        self.assertEqual(extract_skills_section(text), expected)

    def test_extract_skills_no_section(self):
        text = "This resume has no skills section"
        self.assertEqual(extract_skills_section(text), [])

    def test_extract_skills_with_bullets(self):
        text = """
        Technical Skills:
        • Python
        • Machine Learning
        • Data Analysis

        Education
        """
        expected = ["python", "machine learning", "data analysis"]
        self.assertEqual(extract_skills_section(text), expected)


if __name__ == '__main__': 
    unittest.main()


