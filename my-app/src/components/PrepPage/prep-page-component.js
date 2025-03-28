// components/PrepPage.js
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import './prep-page.css';

const PrepPage = () => {
  const { jobId } = useParams();

  return (
    <div className="prep-page-container">
      <div className="prep-content">
        <h1>Preparation Page</h1>
        <p>This is the preparation page for Job ID: {jobId}</p>
        <p>This page is currently empty as specified in the requirements.</p>
        <Link to="/" className="back-button">
          Back to Search
        </Link>
      </div>
    </div>
  );
};

export default PrepPage;
