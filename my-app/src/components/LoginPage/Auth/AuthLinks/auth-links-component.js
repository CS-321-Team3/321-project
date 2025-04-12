import React from 'react';
import { Link } from 'react-router-dom';
import './auth-links.css';

export function AuthLinks() {
  return (
    <div className="auth-links">
      <Link to="/forgot-password" className="auth-link">
        Forgot Password?
      </Link>
      <Link to="/create-account" className="auth-link">
        Create New Account
      </Link>
    </div>
  );
}