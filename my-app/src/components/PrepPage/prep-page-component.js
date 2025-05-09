// components/PrepPage.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './prep-page.css';

const PrepPage = () => {
  const { jobId } = useParams(); // Get jobId from URL
  const [jobDetails, setJobDetails] = useState(null); // State to store job data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch job details when component mounts or jobId changes
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        // Fetch job details using the jobId
        const response = await fetch(`http://localhost:8000/potential_jobs/`); 
        if (!response.ok) {
          throw new Error('Failed to fetch job details');
        }
        const jobs = await response.json();
        
        const job = jobs.find((job) => job.title === jobId);
        setJobDetails(job); // Set the fetched job data
      } catch (err) {
        setError(err.message); // Handle error
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchJobDetails();
  }, [jobId]); // Re-run when jobId changes

  if (loading) {
    return <p>Loading job details...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!jobDetails) {
    return <p>No job details found for ID: {jobId}</p>;
  }

  return (
    <div className="prep-page-container">
      <div className="prep-content">
        <h1>Job Preparation for {jobDetails.title}</h1>
        <p>Job ID: {jobId}</p>
        <p><strong>Description:</strong> {jobDetails.description}</p>
        <p><strong>Requirements:</strong> {jobDetails.requirements}</p>
        <p><strong>Location:</strong> {jobDetails.location}</p>
        <p><strong>Salary:</strong> {jobDetails.salary}</p>
        <Link to="/" className="back-button">
          Back to Search
        </Link>
      </div>
    </div>
  );
};

export default PrepPage;
