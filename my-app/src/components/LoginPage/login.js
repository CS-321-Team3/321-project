import React, { useState } from 'react';
import './LoginScreen.css'; 

// TODO: #4 THIS FILE IS TOO COMPLICATED - SPLIT INTO MULTIPLE SMALLER SEGMENTS


function LoginScreen (){
  // State for login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // State for registration form
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState(false);
  
  // State for authentication and UI
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  const [userData, setUserData] = useState(null);

  // Mock user database - in a real app, this would be an API call
  const mockUsers = [
    { email: 'user@example.com', password: 'password123', name: 'Demo User' }
  ];

  // Handle login submission
  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    
    // Find user in mock database
    const user = mockUsers.find(
      (user) => user.email === loginEmail && user.password === loginPassword
    );
    
    if (user) {
      setIsLoggedIn(true);
      setUserData(user);
    } else {
      setLoginError('Invalid email or password');
    }
  };

  // Handle registration submission
  const handleRegister = (e) => {
    e.preventDefault();
    setRegisterError('');
    
    // Simple validation
    if (!registerName || !registerEmail || !registerPassword) {
      setRegisterError('Please fill in all fields');
      return;
    }
    
    // Check if user already exists
    const userExists = mockUsers.some((user) => user.email === registerEmail);
    if (userExists) {
      setRegisterError('Email already registered');
      return;
    }
    
    // In a real app, you would call an API here
    // For demo, we'll just add to our mock database
    const newUser = {
      email: registerEmail,
      password: registerPassword,
      name: registerName
    };
    mockUsers.push(newUser);
    
    // Show success message and switch to login tab
    setRegisterSuccess(true);
    setTimeout(() => {
      setRegisterSuccess(false);
      setActiveTab('login');
      // Pre-fill login form with new credentials
      setLoginEmail(registerEmail);
      setLoginPassword(registerPassword);
    }, 2000);
  };

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null);
    setLoginEmail('');
    setLoginPassword('');
  };

  // Render the login/register forms if not logged in
  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => setActiveTab('login')}
            >
              Login
            </button>
            <button
              className={`tab ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => setActiveTab('register')}
            >
              Create Account
            </button>
          </div>
          
          {activeTab === 'login' ? (
            // Login Form
            <form onSubmit={handleLogin} className="login-form">
              <h2>Welcome Back</h2>
              {loginError && <div className="error-message">{loginError}</div>}
              
              <div className="form-group">
                <label htmlFor="login-email">Email</label>
                <input
                  type="email"
                  id="login-email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="login-password">Password</label>
                <input
                  type="password"
                  id="login-password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>
              
              <button type="submit" className="submit-button">
                Log In
              </button>
              
              <div className="forgot-password">
                <a href="#forgot">Forgot password?</a>
              </div>
            </form>
          ) : (
            // Registration Form
            <form onSubmit={handleRegister} className="login-form">
              <h2>Create Account</h2>
              {registerError && <div className="error-message">{registerError}</div>}
              {registerSuccess && (
                <div className="success-message">
                  Account created successfully! Redirecting to login...
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="register-name">Full Name</label>
                <input
                  type="text"
                  id="register-name"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="register-email">Email</label>
                <input
                  type="email"
                  id="register-email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="register-password">Password</label>
                <input
                  type="password"
                  id="register-password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  required
                />
              </div>
              
              <button type="submit" className="submit-button">
                Sign Up
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // Render the welcome screen if logged in
  return (
    <div className="welcome-container">
      <div className="welcome-card">
        <h2>Welcome, {userData.name}!</h2>
        <p>You have successfully logged in to your account.</p>
        
        <div className="action-buttons">
          <button className="primary-button">
            Go to Dashboard
          </button>
          <button className="secondary-button" onClick={handleLogout}>
            Log Out
          </button>
        </div>
        
        <div className="quick-links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#profile">View Profile</a></li>
            <li><a href="#settings">Account Settings</a></li>
            <li><a href="#help">Help Center</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;