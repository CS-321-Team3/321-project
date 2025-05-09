import FileUpload from './FileUpload/file-upload-component';
import JobResults from './JobResults/job-results-component';
import SearchBar from './SearchBar/search-bar-component';
import "./main-page.css"
import { useParams } from 'react-router-dom';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import React from 'react';

// Example React code for uploading a PDF and getting skills
async function uploadResume(file) {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("http://localhost:8000/extract-skills/", {
      method: "POST",
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error("Failed to process the resume");
    }
    
    const data = await response.json();
    console.log("Extracted skills:", data.skills);
    return data.skills;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

async function getJobInformation(query) {
  const formData = new FormData();
  formData.append("query", query);

  try {
    const response = await fetch("http://localhost:8000/get-job-listings/", {
      method: "POST",
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error("Failed to process the resume");
    }
    
    const data = await response.json();
    return data.jobs;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }  
}

const MainPage = () => {
  const { userId } = useParams();

  console.log(userId);

  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [resumeInformation, setResumeInformation] = useState(null);
  const fileInputRef = useRef(null);

  const navigate = useNavigate();

  const handleSearch = async (query) => {
    setIsLoading(true);
    const results = await getJobInformation(query);
    localStorage.setItem('jobListingInformation', JSON.stringify(results));
    setSearchResults(results);
    setHasSearched(true);
    setIsLoading(false);
  
  };

  const handlePrepare = (job) => {
    if (job == null || resumeInformation == null){
      console.log("hey you need both");
    } else {
      navigate(`/prepare/${job._id}`);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    console.log(selectedFile);
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      handleUpload(selectedFile);
    } else if (selectedFile) {
      alert('Please upload a PDF file only.');
      fileInputRef.current.value = null;
    }
  };

  const handleUpload = async (selectedFile) => {
    setUploading(true);
    setUploadSuccess(false);
    
    // Simulate upload process
    console.log(`File "${selectedFile.name}" would be uploaded to database`);
    setUploading(false);
    setUploadSuccess(true);
    const extractedInformation = await uploadResume(selectedFile);
    setFile(null);
    setResumeInformation(extractedInformation);
    localStorage.setItem('resumeExtraction', JSON.stringify(extractedInformation));
    
    // Reset success message after some time
    setTimeout(() => {
      setUploadSuccess(false);
    }, 3000);
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="app-container">
      <div className="main-content">
        <div className="left-panel">
          <FileUpload 
            uploading={uploading} 
            uploadSuccess={uploadSuccess} 
            handleButtonClick={handleButtonClick} 
            handleFileChange={handleFileChange} 
            fileInputRef={fileInputRef} 
            file={file} 
          />
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

export default MainPage;