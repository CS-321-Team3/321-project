import React, { useState } from "react";
import './account-creation.css'
import { useNavigate } from "react-router-dom";

async function signup(username, password, email) {
    console.log(username, password, email);
    
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);
      formData.append("email", email)
  
      const response = await fetch("http://localhost:8000/signup/", {
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
      if (!(data.status === 200)) {
        throw new Error("Something went wrong");
      }

      return;
    } catch (error) {
      // Re-throw the error to be caught by the caller
      throw error;
    }
  }

export default function AccountCreation() {
    const [credentials, setCredentials] = useState({
        username: '',
        password: '',
        email:    ''
    });

    const navigate = useNavigate();

    const handleCredentialChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({
        ...prev,
        [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signup(credentials['username'], credentials['password'], credentials['email']);
            console.log('successfully created new account');
            navigate('/');
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="form-container">
            <h1 className="header">Create Account</h1>
            <form onSubmit={handleSubmit} className="signup-form">
                <div className="form-group">
                    <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={credentials.username}
                    onChange={handleCredentialChange}
                    required
                    />
                </div>
                <div className="form-group">
                    <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={credentials.password}
                    onChange={handleCredentialChange}
                    required
                    />
                </div>
                <div className="form-group">
                    <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={credentials.email}
                    onChange={handleCredentialChange}
                    required
                    />
                </div>
                <button type="submit" className="signin-button">
                    Create Account
                </button>
            </form>

        </div>
    );
}