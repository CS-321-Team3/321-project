// src/components/GoogleSignInButton.js
import React from 'react';
import './google-auth.css';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'

export function GoogleSignInButton() {
  const navigate = useNavigate();
  
  const handleSuccess = (credentialResponse) => {
    console.log("Successful log-in");
    const user = jwtDecode(credentialResponse.credential);
    const sub = user.sub
    const name = user.name;
    console.log(name, sub);
    navigate(`/user/${sub}`);
  }

  const handleError = (credentialResponse) => {
    console.error("Unsuccessful log-in");
    console.log(jwtDecode(credentialResponse.credential));
    navigate('/');
  }

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={handleError}
    />
  );
}