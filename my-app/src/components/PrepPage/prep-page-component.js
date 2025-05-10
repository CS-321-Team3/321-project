import React from 'react';
import SkillsNeeded from './SkillsNeeded';
import Calendar from './Calendar';
import './JobApplicationPage.css';

async function getcal(resumeskills, jobskills, timeneeded) {
  const formData = new FormData();
  formData.append('resume_skills', resumeskills);
  formData.append('job_skills', jobskills);
  formData.append('time_per_skill', timeneeded);
  
  try {
    const response = await fetch("http://localhost:8000/get-schedule/", {
      method: "POST",
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error("Failed to process the resume");
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

const PrepPage = () => {
  // state for calendar available
  job = JSON.parse(localStorage.getItem('jobListingInformation'));
  resume = JSON.parse(localStorage.getItem('resumeExtraction'));

  missingSkills = job.skills.map(item => item.skill).slice(0, 10);

  const [timeNeeded, setTimeNeeded] = useState(
    skills.reduce((acc, skill) => {
      acc[skill.name] = skill.defaultTime || '';
      return acc;
    }, {})
  );

  const handleTimeChange = (skillName, value) => {
    setTimeNeeded(prev => ({
      ...prev,
      [skillName]: value
    }));
  };

  return (
    <div className="job-application-container">
      <h1 className="job-title">{job.jobname}</h1>
      <div className="content-layout">
        <div className="skills-section">
          <SkillsNeeded skills={missingSkills} timeNeeded={timeNeeded} handleTimeChange={handleTimeChange} />
        </div>
        <div className="calendar-section">
          <Calendar icsFilePath={icsFilePath} />
        </div>
      </div>
    </div>
  );
};

export default PrepPage;
