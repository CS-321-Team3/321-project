// src/pages/LoginScreen.js
import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { LoginForm } from './LoginForm/login-form-component';
import { TitleBanner } from './TitleBanner/title-banner-component';
import { AuthLinks } from './AuthLinks/auth-links-component';
import { GoogleSignInButton } from './GoogleAuth/google-auth-component';
import './login.css';

export default function LoginScreen() {
  let attempts = 0;
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  // const navigate = useNavigate();

  const handleCredentialChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    // Authentication logic would go here - refer to secure sql server
    attempts ++;
    console.log('Sign in attempt: ', attempts);
    // navigate('/user/1'); // as a stub
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