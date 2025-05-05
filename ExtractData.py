import requests
from requests.auth import HTTPBasicAuth
import time
import json
USERNAME = "student10"
PASSWORD = "4249zfn"
mainurl = "https://services.onetcenter.org/ws/online/occupations/"
listofjobs = []
while(mainurl): 
    time.sleep(0.5)  # Delay to slow down requests to not overload the server
    response = requests.get(mainurl, auth=HTTPBasicAuth(USERNAME, PASSWORD), headers = {"Accept": "application/json"})
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        print("success")
        

        data = response.json() 
        #print(json.dumps(data, indent=4, sort_keys=True))  #prints the raw data taken
        for v in data['occupation']:
            listofskills = []
            jerbname = v['title']
            jobcode = v['code']
            print(jobcode)
            time.sleep(0.5)  # Delay to slow down requests to not overload the server
            url = "https://services.onetcenter.org/ws/online/occupations/" + jobcode + "/details/skills"
            response2 = requests.get(url, auth=HTTPBasicAuth(USERNAME, PASSWORD), headers = {"Accept": "application/json"})
            data2 = response2.json()
            #print(json.dumps(data2, indent=4, sort_keys=True)) #prints the raw data2 taken
            elements = data2.get("element",[])
            if not elements:
                print(f"No skills found for occupation {jobcode}")
            else:
                for x in data2['element']:
                    jobskill = x['name']
                    listofskills.append(jobskill)
                document = {
                    "jobname": jerbname,
                    "skills": listofskills
                    }
                listofjobs.append(document)
        
    else:
        print("failure")
    #check if we loop to get another 20 or stop.
    #tes
    mainurl = None;
    for link in data.get("link", []):
        if link.get("rel") == "next":
            mainurl = link.get("href")
            break
with open("jobs_with_skills.json", "w") as f:
    json.dump(listofjobs, f, indent=2)