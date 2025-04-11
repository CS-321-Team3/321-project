// components/FileUpload.js
import React, { useState, useRef } from 'react';
import './file-upload.css'

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
    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef(null);

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

  const handleUpload = (selectedFile) => {
    setUploading(true);
    setUploadSuccess(false);
    
    // Simulate upload process
    setTimeout(() => {
      console.log(`File "${selectedFile.name}" would be uploaded to database`);
      setUploading(false);
      setUploadSuccess(true);
      uploadResume(selectedFile);
      // Reset success message after some time
      setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
    }, 2000);
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="file-upload-container">
      <h2>File Upload</h2>
      <div 
        className={`upload-box ${uploading ? 'uploading' : ''} ${uploadSuccess ? 'success' : ''}`} 
        onClick={handleButtonClick}
      >
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="file-input"
        />
        
        {!uploading && !uploadSuccess && (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p>{file ? file.name : 'Upload PDF'}</p>
          </>
        )}
        
        {uploading && (
          <div className="spinner-container">
            <div className="spinner"></div>
            <p>Uploading...</p>
          </div>
        )}
        
        {uploadSuccess && (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <p>Upload Complete!</p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
