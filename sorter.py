#sorter.py © 2025 Sophia Denayer, all rights reserved
#project: 321 JobSpanner
#other contributors: Anoop Peterson, David Ball

#This file is in charge of recommending other skills and technologies based on
#user's resume, and searched input. Additionally, priorities jobs in order based on 
#the skills in the user's resume

#Team members: add any documentation notes for changes and etc. Thank you!
# - This document needs to be connected later on to data base and parsed info from
#   inserted resume
# - 221: #not in, if in, it would be curr skills
        #NOTE YOU CAN VALIDATE THIS WORKS BY CHANGING TO 'in'^
        #cant work yet because we need database
from ics import Calendar, Event
from datetime import time
from datetime import datetime, timedelta, date
from zoneinfo import ZoneInfo

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
#person's inputted free time (user will input what hours they are free at
#this will be converted into military time
curr_freetime = {
    "Monday" : {5, 6, 11, 16},
    "Tuesday": {8, 9, 13, 3},
    "Wednesdy": {5, 7, 20, 21},
    "Thursday": {4, 5, 6, 14, 15},
    "Friday": {3, 4},
    "Saturday" : {0},
    "Sunday" : {0}
}

#how long each skill takes to learn
skill_time = {"python": 3, "sociable": 1, "kind": 2}

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

#group the hours together 
def group_hours(hours):
    hours = list(hours)
    hours.sort()
    time_block = []
    #check if there is an hour list
    if not hours:
        return time_block
    #create start and end
    start = hours[0]
    end = hours[0]
    #check the hour in hours
    for hour in hours[1:]:
        #check to see if the new hour is end + 1
        #if so, then we can make it part of this block
        if hour == end + 1:
            end = hour
        else:
           time_block.append((start, end)) #make a new block
           start = hour
           end = hour
    #add in the last time block
    time_block.append((start, end))
    return time_block
        
#use persons schedule and skills needed to develop
def make_schedule(searched_words, potential_jobs, resume_skills, curr_freetime, skill_time):
    needed_skills = best_skills(searched_words, potential_jobs, resume_skills)
    #first check to see if needed skills are on resume
    study_skills = []
    #dict with day, time, skill
    final_schedule = {}
    #go through skills in the needed
    for skill in needed_skills:
        #see if the needed skill is in the resume
        if skill not in resume_skills: #not in, if in, it would be curr skills //NOT IN
        #NOTE YOU CAN VALIDATE THIS WORKS BY CHANGING TO 'in'^
        #cnat work yet because we need database
            #add the skill to the actual needed skill
            study_skills.append(skill)
    #find how many hours there are in each day
    for day, hours in curr_freetime.items():
        #group the hours into time blocks
        time_block = group_hours(hours)
        #go through each time block
        for block in time_block:
            start, end = block
            #create block length
            block_len = end - start + 1
            #go through each skill and itme in skill time
            for skill, time in skill_time.items():
                #see if block len is equal to time and skill is in study skills
                if skill in study_skills and block_len == time:
                    #make string
                    time_ran = f"{start}-{end+1}"
                    #if not made, make it
                    if day not in final_schedule:
                        final_schedule[day] = []
                    #append time ran and skill
                    final_schedule[day].append((time_ran, skill)) 
                    #remove the skill
                    study_skills.remove(skill)         
                else:
                    continue
                break
    print(final_schedule)
    event_data(final_schedule)
    return(final_schedule)
    
def event_data(final_schedule):
    #create a new calendar
    calendar = Calendar()
    #go through keys and valus in the schedule
    for key, val in final_schedule.items():
        #get the day
        day = date_of_day(key)
        #go through the skills and timez in val
        for the_time, skill in val:
            #create event
            event = Event()
            #set event name
            event.name = skill
            #check to make sure that we have full string
            if "-" in the_time and len(the_time.split("-")) == 2:
                #split to get start and end
                start, end = map(int, the_time.split("-"))
                #set begin time with NY time
                event.begin = datetime.combine(day, time(start)).replace(tzinfo = ZoneInfo("America/New_York"))
                #find how many hours from end - start
                hour = end - start
                #set event duration
                event.duration = timedelta(hours = hour)
                #add the event to the cal
                calendar.events.add(event)
    #open the fil and write
    with open("calendar_schedule.ics", "w") as file:
        file.writelines(calendar)
    #opent the file and read
    with open("calendar_schedule.ics", "r") as file:
        imported_calendar = Calendar(file.read())
    
   # The code below is good for testing!
   # for event in imported_calendar.events:
   #     print("Event Name:", event.name)
   #     print("Start Time:", event.begin)
    #    print("End Time:", event.end)
    #    print("Duration:", event.duration)
    #    print("-" * 40)
    #print(event)
    return event
    
#date of day's code originated from ChatGPT code, but was modified
def date_of_day(day):
    #day options
    wkdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    #curr day
    today = datetime.today()
    tdy_wday = today.weekday()
    #finding day we want
    targ_wday = wkdays.index(day)
    #get to the target day
    days_infront = (targ_wday - tdy_wday + 6) % 7 #need to check this line!! (during testing)
    if days_infront == 0:
        days_infront == 6
    next_day = today + timedelta(days = days_infront)
    final_day = next_day.date()
    return final_day

#tests 1st
search_jobs(searched_words, potential_jobs)
#tests 2nd 
search_skills(searched_words, potential_jobs)
#tests 3rd
best_jobs(searched_words, potential_jobs, resume_skills)
#tests 4th
best_skills(searched_words, potential_jobs, resume_skills)
#tests 5th
make_schedule(searched_words, potential_jobs, resume_skills, curr_freetime, skill_time)

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
        
      

