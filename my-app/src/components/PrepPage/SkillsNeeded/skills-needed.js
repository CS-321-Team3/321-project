import React, { useState } from 'react';
import './skills-needed.css';

const SkillsNeeded = ({ skills = [], timeNeeded, handleTimeChange }) => {
  return (
    <div className="skills-needed-container">
      <h2 className="skills-header">You need:</h2>
      <div className="skills-list">
        {skills.map(skill => (
          <div key={skill.name} className="skill-item">
            <div className="skill-name">{skill.name}</div>
            <div className="time-input-container">
              <input
                type="text"
                className="time-input"
                value={timeNeeded[skill.name]}
                onChange={(e) => handleTimeChange(skill.name, e.target.value)}
                placeholder="0"
              />
              <span className="time-unit">hrs</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsNeeded;