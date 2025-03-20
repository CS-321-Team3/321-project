// components/JobResults.js
import React from 'react';
import './job-results.css';

const JobResults = ({ results, onPrepare, isLoading }) => {
  if (isLoading) {
    return (
      <div className="results-container loading-container">
        <div className="results-loading">
          <div className="results-spinner"></div>
          <p>Searching for jobs...</p>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="results-container">
        <div className="no-results">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
          <p>No jobs found. Try a different search.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="results-container">
      <h3>Results</h3>
      <div className="results-list">
        {results.map((job) => (
          <div key={job.id} className="job-card">
            <div className="job-info">
              <h4 className="company-name">{job.company}</h4>
              <h5 className="position-title">{job.position}</h5>
              <p className="job-location">{job.location}</p>
              {/* add required/desired skills */}
              {/* standardize job entry object */}
            </div>
            <button 
              className="prephandleUploadare-button"
              onClick={() => onPrepare(job.id)}
            >
              Prepare!
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobResults;
