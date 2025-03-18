#sorter.py © 2025 Sophia Denayer, all rights reserved
#project: 321 JobSpanner
#other contributors: Anoop Peterson

#This file is in charge of recommending other skills and technologies based on
#user's resume, and searched input. Additionally, priorities jobs in order based on 
#the skills in the user's resume

#Team members: add any documentation notes for changes and etc. Thank you!
# - This document needs to be connected later on to data base and parsed info from
#   inserted resume

#jobs that could pop up
potential_jobs = {
    "Amazon SDE" : {
        "words": ["aws", "computer"], 
        "skills": ["coding", "sociable", "hardworking", "python"]
    },
    "Google intern" : {
        "words": ["internship", "google"],
        "skills": ["kind", "coding"]
    },
    "Elementary School Teacher" : {
        "words": ["teaching", "elementary school"],
        "skills": ["kind", "teaching", "sociable"]
    },
    "Nurse": {
        "words": ["healthcare", "hospital"],
        "skills": ["compassion", "medical knowledge", "attention to detail"]
    },
    "Graphic Designer": {
        "words": ["design", "creative"],
        "skills": ["creativity", "Adobe Photoshop", "visual communication"]
    },
    "Electrician": {
        "words": ["wiring", "electrical work"],
        "skills": ["technical knowledge", "troubleshooting", "safety awareness"]
    },
    "Marketing Manager": {
        "words": ["advertising", "branding"],
        "skills": ["strategic thinking", "communication", "data analysis"]
    }
    
}
#searched words in search bar
searched_words = ["job", "Computer Science", "internship", "intern", "aws", "google"]
searched_words_2 = ["job", "teaching", "internship", "intern", "elementary school"]
searched_words_3 = ["healthcare", "hospital"]
searched_words_4 = ["design", "creative"]
searched_words_5 = ["wiring", "electrical work", "creative"]
searched_words_6 = ["wiring", "advertising", "branding"]
#skills in inserted resume
resume_skills = ["hardworking", "sociable", "kind", "coding", "python"]
resume_skills_2 = ["hardworking", "sociable", "kind", "coding", "python", "teaching"]
resume_skills_3 = ["compassion", "medical knowledge", "attention to detail"]
resume_skills_4 = ["creativity", "Adobe Photoshop", "visual communication"]
resume_skills_5 = ["technical knowledge", "troubleshooting", "safety awareness"]
resume_skills_6 = ["strategic thinking", "communication", "data analysis"]

#finds best jobs based on searched words
def search_jobs(searched_words, potential_jobs):
    #make new dict, and add counts and jobs
    priority = {}
    #go through the groups in the dict
    for group in potential_jobs:
        #going through words
        words = potential_jobs[group]["words"]
        #checking the values
        for val in words:
            if val in searched_words:
                #checking if in the priority dict
                if group not in priority:
                    priority[group] = 1
                else:
                    priority[group] += 1
    counter = 0
    #function below sorts dict from highest val to lowest val
    sort_dic = dict(sorted(priority.items(), key = lambda item: item[1], reverse = True))
    #prints out for testing right now
    print(sort_dic)
    #return the value
    return sort_dic
    
#finds the important skills required based on searched (outputs as list/arr)
def search_skills(searched_words, potential_jobs):
    job_ordering = search_jobs(searched_words, potential_jobs)
    priority = []
    #going through the keys and values in job_ordering
    for k, v in job_ordering.items():
        #checking if that key is in potential jobs
        if k in potential_jobs:
            #making a variable assigning our skills 
            skills = potential_jobs[k]["skills"]
            #check if skills is not already in priority
            if skills not in priority:
                #if not in priority, add it priority
                priority += skills
    #need to make sure that there are no dups
    sorted_list = []
    #set of the values we have already seen
    we_saw = set()
    #going through the values
    for value in priority:
        #if we didnt see it
        if value not in we_saw:
            #add to our new sorted list
            sorted_list.append(value)
            #add it to our seen values
            we_saw.add(value)
    print(sorted_list)
    return sorted_list
                
#finds jobs based on resume skills and on data inserted into search
def best_jobs(searched_words, potential_jobs, resume_skills):
    jobs = search_jobs(searched_words, potential_jobs)
    #make new dict
    priority = {}
    #go through the groups in dict
    for group in potential_jobs:
        #going through skills
        skills = potential_jobs[group]["skills"]
        #checking the values
        for val in skills:
            if val in resume_skills:
                #checking if in priority dict
                if group not in priority:
                    priority[group] = 1
                else:
                    priority[group] += 1
    counter = 0
    #go through the values in the jobs list
    for k, v in jobs.items():
        #checking if we have the key in the priority
        if k in priority:
            priority[k] += v
        else:
            priority[k] = v 
    #sorts which job has priority based on resume
    sort_dic = dict(sorted(priority.items(), key = lambda item: item[1], reverse = True))
    print(sort_dic)
    return sort_dic
    
#finds the most important skills required based on resume skills (outputs as list/arr)
def best_skills(searched_words, potential_jobs, resume_skills):
    job_ordering = best_jobs(searched_words, potential_jobs, resume_skills)
    priority = []
    #going through the keys and values in best_jobs
    for k, v in job_ordering.items():
        #checking if that key is in potential jobs
        if k in potential_jobs:
            #making a variable assigning our skills
            skills = potential_jobs[k]["skills"]
             #check if skills is not already in priority
            if skills not in priority:
                #if not in priority, add it priority
                priority += skills
    #need to make sure that there are no dups
    sorted_list = []
    #set of the values we have already seen
    we_saw = set()
    for value in priority:
        #if we didnt see it
        if value not in we_saw:
            #add to our new sorted list
            sorted_list.append(value)
             #add it to our seen values
            we_saw.add(value)
    print(sorted_list)
    return sorted_list
    
#tests 1st
search_jobs(searched_words, potential_jobs)
#tests 2nd 
search_skills(searched_words, potential_jobs)
#tests 3rd
best_jobs(searched_words, potential_jobs, resume_skills)
#tests 4th
best_skills(searched_words, potential_jobs, resume_skills)

# unit tests
import unittest

class TestSorter(unittest.TestCase):
    def test_jobs(self):
        self.assertEqual(search_jobs(searched_words, potential_jobs), {'Google intern': 2, 'Amazon SDE': 1})
    def test_jobs_2(self):
        self.assertEqual(search_jobs(searched_words_2, potential_jobs), {'Elementary School Teacher': 2, 'Google intern': 1})
    def test_jobs_3(self):
        self.assertEqual(search_jobs(searched_words_6, potential_jobs), {'Marketing Manager': 2, 'Electrician': 1})
    def test_jobs_4(self):
        self.assertEqual(search_jobs(searched_words_5, potential_jobs), {'Electrician': 2, 'Graphic Designer': 1})
    def test_jobs_5(self):
        self.assertEqual(search_jobs(searched_words_4, potential_jobs), {'Graphic Designer': 2})
    def test_skills(self):
        self.assertEqual(search_skills(searched_words, potential_jobs), ['kind', 'coding', 'sociable', 'hardworking', 'python'])
    def test_skills_2(self):
        self.assertEqual(search_skills(searched_words_2, potential_jobs), ['kind', 'teaching', 'sociable', 'coding'])
    def test_skills_3(self):
        self.assertEqual(search_skills(searched_words_4, potential_jobs), ['creativity', 'Adobe Photoshop', 'visual communication'])
    def test_skills_4(self):
        self.assertEqual(search_skills(searched_words_3, potential_jobs), ['compassion', 'medical knowledge', 'attention to detail'])

    def test_best_jobs(self):
        self.assertEqual(best_jobs(searched_words, potential_jobs, resume_skills), {'Amazon SDE': 5, 'Google intern': 4, 'Elementary School Teacher' : 2})
    def test_best_jobs_2(self):
        self.assertEqual(best_jobs(searched_words_2, potential_jobs, resume_skills_5), {'Electrician': 3, 'Elementary School Teacher': 2, 'Google intern': 1})
    def test_best_jobs_3(self):
        self.assertEqual(best_jobs(searched_words_5, potential_jobs, resume_skills_5), {'Electrician': 5, 'Graphic Designer': 1})
    def test_best_jobs_4(self):
        self.assertEqual(best_jobs(searched_words_6, potential_jobs, resume_skills_6), {'Marketing Manager': 5, 'Electrician': 1})
    def test_best_skills(self):
        self.assertEqual(best_skills(searched_words, potential_jobs, resume_skills), ['coding', 'sociable', 'hardworking', 'python', 'kind', 'teaching'])
    def test_best_skills(self):
        self.assertEqual(best_skills(searched_words_2, potential_jobs, resume_skills_2), ['kind', 'teaching', 'sociable', 'coding', 'hardworking', 'python'])
    def test_best_skills(self):
        self.assertEqual(best_skills(searched_words_6, potential_jobs, resume_skills_3), ['compassion', 'medical knowledge', 'attention to detail', 'strategic thinking', 'communication', 'data analysis', 'technical knowledge', 'troubleshooting', 'safety awareness'])
    def test_best_skills(self):
        self.assertEqual(best_skills(searched_words_3, potential_jobs, resume_skills_5), ['technical knowledge', 'troubleshooting', 'safety awareness', 'compassion', 'medical knowledge', 'attention to detail'])
        
      

