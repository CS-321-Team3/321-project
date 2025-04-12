import React from 'react';
import './login-form.css';

export function LoginForm({ credentials, onCredentialChange, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="login-form">
      <div className="form-group">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={credentials.username}
          onChange={onCredentialChange}
          required
        />
      </div>
      <div className="form-group">
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={credentials.password}
          onChange={onCredentialChange}
          required
        />
      </div>
      <button type="submit" className="signin-button">
        Sign In
      </button>
    </form>
  );
}