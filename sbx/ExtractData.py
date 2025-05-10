import requests
import unittest
from requests.auth import HTTPBasicAuth
import time
import json

def main():
    USERNAME = "student10"
    PASSWORD = "4249zfn"
    mainurl = "https://services.onetcenter.org/ws/online/occupations/"
    listofjobs = []
    while(mainurl):
        testvalue = 0;
        time.sleep(0.21)  # Delay to slow down requests to not overload the server
        response = requests.get(mainurl, auth=HTTPBasicAuth(USERNAME, PASSWORD), headers = {"Accept": "application/json"})
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            print("success")
            testvalue = 1;

            data = response.json() 
            #print(json.dumps(data, indent=4, sort_keys=True))  #prints the raw data taken
            for v in data['occupation']:
                listofskills = []
                listoftskills = []
                jerbname = v['title']
                jobcode = v['code']
                print(jerbname)
                #request the job skills
                time.sleep(0.21)  # Delay to slow down requests to not overload the server
                url = "https://services.onetcenter.org/ws/online/occupations/" + jobcode + "/details/skills?display=long"
                response2 = requests.get(url, auth=HTTPBasicAuth(USERNAME, PASSWORD), headers = {"Accept": "application/json"})
                data2 = response2.json()
                #print(json.dumps(data2, indent=4, sort_keys=True)) #prints the raw data2 taken
                elements = data2.get("element",[])
                
                if not elements:
                    print(f"No jobs skills found for occupation {jobcode}")
                else:
                    for x in data2['element']:
                        importance = int(x['score']['value'])
                        jobskill = {
                        "Skill Name" :x['name'],
                        "Skill Importance": importance
                        
                        }
                        listofskills.append(jobskill)
                #request the job description
                url = "https://services.onetcenter.org/ws/online/occupations/" + jobcode + "/"
                time.sleep(0.21)  # Delay to slow down requests to not overload the server
                response3 =  requests.get(url, auth=HTTPBasicAuth(USERNAME, PASSWORD), headers = {"Accept": "application/json"})
                data3 = response3.json()
                #print(json.dumps(data3, indent=4, sort_keys=True)) #prints the raw data2 taken
                #request the technology skills
                time.sleep(0.21)  # Delay to slow down requests to not overload the server
                url = "https://services.onetcenter.org/ws/online/occupations/" + jobcode + "/summary/technology_skills?display=long"
                response4 = requests.get(url, auth=HTTPBasicAuth(USERNAME, PASSWORD), headers = {"Accept": "application/json"})
                data4 = response4.json()
                #print(json.dumps(data4, indent=4, sort_keys=True)) #prints the raw data4 taken
                elements2 = data4.get("category",[])
                
                if not elements2:
                    print(f"No tech skills found for occupation {jobcode}")
                else:
                    for x in data4['category']:
                        for y in x['example']:
                        
                            techskill = y['name']
                            listoftskills.append(techskill)
                document = {
                    "jobname": jerbname,
                    "job_description": (data3['description']),
                        
                    "skills": listofskills,
                    "technology_skills": listoftskills
                    }
                #print(document)
                listofjobs.append(document)
        
        else:
            print("failure")
        #check if we loop to get another 20 or stop.
        #
        mainurl = None;
        for link in data.get("link", []):
            if link.get("rel") == "next":
                mainurl = link.get("href")
                break
    with open("../data/jobs_with_skills.json", "w") as f:
        json.dump(listofjobs, f, indent=2)
    return testvalue
#test
class Test(unittest.TestCase):
    def test_maintest(self):
        self.assertEqual(1, main())
if __name__ == '__main__':
    unittest.main()