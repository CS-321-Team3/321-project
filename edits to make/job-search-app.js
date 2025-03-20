// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import FileUpload from './components/FileUpload';
import SearchBar from './components/SearchBar';
import JobResults from './components/JobResults';
import PrepPage from './components/PrepPage';

function MainApp() {
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (query) => {
    setIsLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Mock data - in a real app, this would come from an API
      const mockResults = [
        { id: 1, company: "Tech Solutions Inc.", position: "Frontend Developer", location: "Remote" },
        { id: 2, company: "Digital Innovations", position: "React Developer", location: "New York, NY" },
        { id: 3, company: "Webflow Systems", position: "UI Engineer", location: "San Francisco, CA" },
        { id: 4, company: "Creative Tech", position: "Full Stack Developer", location: "Austin, TX" },
      ].filter(job => 
        job.company.toLowerCase().includes(query.toLowerCase()) || 
        job.position.toLowerCase().includes(query.toLowerCase())
      );
      
      setSearchResults(mockResults);
      setHasSearched(true);
      setIsLoading(false);
    }, 1500);
  };

  const handlePrepare = (jobId) => {
    navigate(`/prepare/${jobId}`);
  };

  return (
    <div className="app-container">
      <div className="main-content">
        <div className="left-panel">
          <FileUpload />
        </div>
        <div className="right-panel">
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
          {hasSearched && (
            <JobResults 
              results={searchResults} 
              onPrepare={handlePrepare} 
              isLoading={isLoading} 
            />
          )}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/prepare/:jobId" element={<PrepPage />} />
      </Routes>
    </Router>
  );
}

export default App;
