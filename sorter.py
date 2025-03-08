#sorter.py © 2025 Sophia Denayer, all rights reserved
#project: 321 JobSpanner
#other contributors: n/a

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
    }
}
#searched words in search bar
searched_words = ["job", "Computer Science", "internship", "intern", "aws", "google"]
#skills in inserted resume
resume_skills = ["hardworking", "sociable", "kind", "coding", "python"]

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

