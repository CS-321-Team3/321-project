import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

async function querySQL(body) {
  console.log("querying now: ", body)

  try {    
    const response = await fetch(`http://localhost:8000/password-reset/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": 'http://localhost:8000/'
      },
      body: body,
    });
    
    // Handle HTTP errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.detail || `Error: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }
    
    // Parse the response
    const data = await response.json();
      
    return data;
  } catch (error) {
    // Re-throw the error to be caught by the caller
    throw error;
  }
}

export default function PasswordReset() {
  /**
   * change your password. enter in either username or email into one textbox.
   * if recognized, then show a new textbox with new password
   * update new password in python
   */
  const [foundUsername, setFoundUsername] = useState(false);
  const [username, setUsername] = useState(null);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("foundUsername ", foundUsername);
    if (foundUsername) {
      try {
        const data = await querySQL(JSON.stringify(
          { 
            "found_username": true,
            "username": username,
            "password": credentials['password']
          }
        ));

        console.log('Hopefully password change successful! ', data);
        navigate('/');
      } catch (error) {
        console.log("Error in password-reset-component.js: ", error)
      }
      
    } else {
      console.log("haven't found username yet");
      try {
        const response = await querySQL(JSON.stringify(
          { 
            "found_username": false,
            "username": credentials['username'],
            "password": null,
          }
        ));

        setUsername(response);
        setFoundUsername(true); // eventually switch to password change
      } catch (error) {
        console.log("Error in password-reset-component.js: ", error)
      } 
    }
    console.log("foundUsername ", foundUsername);
  };

  if (foundUsername) {
      return (
        // password form
          <form onSubmit={handleSubmit} className="login-form"> 
              <div className="password-reset">
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
              </div>
              <button type="submit" className="signin-button">
                Reset Password
              </button>
          </form>
      );    
  } else {
      return (
        // username form
          <form onSubmit={handleSubmit}> 
              <div className="username-reset">
                  <div className="form-group">
                      <input
                      type="username"
                      name="username"
                      placeholder="Username"
                      value={credentials.username}
                      onChange={handleCredentialChange}
                      required
                      />
                  </div>
              </div>
              <button type="submit" className="signin-button">
                Submit
              </button>
          </form>
      );      
  }
    
}