import React, { useState } from 'react';
import SkillsNeeded from './SkillsNeeded/skills-needed';
import Calendar from './Calendar/calendar';
import './prep-page.css';

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
  // const job = JSON.parse(localStorage.getItem('jobListingInformation'));
  const resume = JSON.parse(localStorage.getItem('resumeExtraction'));
  console.log(`prep page: ${resume}`)
  const missingSkills = ['Python', 'Java', 'GraphQL', 'Prompt Engineering']

  const [timeNeeded, setTimeNeeded] = useState(
    missingSkills.reduce((acc, skill) => {
      acc[skill] = skill.defaultTime || '';
      return acc;
    }, {})
  );

  const handleTimeChange = (skillName, value) => {
    setTimeNeeded(prev => ({
      ...prev,
      [skillName]: value
    }));
  };

  const [icsFilePath, setICSFilepath] = useState(null);
  const [haveSchedule, setHaveSchedule] = useState(false);

  const handleSubmit = async () => {
    const ical_fp = await getcal(resume, missingSkills, timeNeeded);
    setICSFilepath(ical_fp);
    setHaveSchedule(true);
  }
  
  return (
    <div className="prep-page-container">
      <h1 className="prep-content">Preparation</h1>
      <div className="content-layout">
        <div className="skills-section">
          <SkillsNeeded skills={missingSkills} timeNeeded={timeNeeded} handleTimeChange={handleTimeChange} />
          <div className="action-button-container">
            <button 
              className="generate-plan-button" 
              onClick={handleSubmit}
            >
              Generate Learning Plan
            </button>
          </div>
        </div>
        <div className="calendar-section">
          { haveSchedule && (<Calendar icsFilePath={icsFilePath} />)}
        </div>
      </div>
    </div>
  );
};

export default PrepPage;
