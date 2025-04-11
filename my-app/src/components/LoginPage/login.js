// src/pages/LoginScreen.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from './LoginForm/login-form-component';
import { TitleBanner } from './TitleBanner/title-banner-component';
import { AuthLinks } from './AuthLinks/auth-links-component';
import { GoogleSignInButton } from './GoogleAuth/google-auth-component';
import './login.css';

async function userauth(username, password) {
  try {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    const response = await fetch("http://localhost:8000/login/", {
      method: "POST",
      body: formData,
    });
    
    // Handle HTTP errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.detail || `Error: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }
    
    // Parse the response
    const data = await response.json();
    
    // Check if the ID exists in the response
    if (!data.id) {
      throw new Error("Invalid response: missing user ID");
    }
    
    // Return just the ID
    return data.id;
  } catch (error) {
    // Re-throw the error to be caught by the caller
    throw error;
  }
}

// Example usage:


export default function LoginScreen() {
  let attempts = 0;
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleCredentialChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    // Authentication logic: 1) send username and password to fastapi backend. 2) backend calls sqlite query. 3) backend either returns id or None. 
    // requires the sql db to have id as primary key, username as a string, password as a hash
        
    try {
      const userId = await userauth("username", "password");
      console.log("Login successful, user ID:", userId);
      navigate(`users/${userId}`);
    } catch (error) {
      attempts ++;
      console.log("attempts: ", attempts);
      console.error("Login failed:", error.message);
    }
  };

  return (
    <div className="login-container">
      <TitleBanner />
      <div className="login-card">
        <LoginForm 
          credentials={credentials}
          onCredentialChange={handleCredentialChange}
          onSubmit={handleSignIn}
        />
        <AuthLinks />
        <div className="google-signin-section">
          <GoogleSignInButton />
        </div>
      </div>
    </div>
  );
}