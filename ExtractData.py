import requests
from requests.auth import HTTPBasicAuth
import time
import json
response = requests.get(https://services.onetcenter.org/ws/online/occupations/.json, auth=HTTPBasicAuth(USERNAME, PASSWORD)

for v in response['occupation']:
    jobcode = job['code']
    