// components/FileUpload.js
import React from 'react';
import './file-upload.css'

const FileUpload = ( {uploading, uploadSuccess, handleButtonClick, handleFileChange, fileInputRef, file} ) => {
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
