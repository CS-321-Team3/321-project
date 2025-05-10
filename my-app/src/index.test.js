import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';

// Mock Google OAuth Provider to isolate test
jest.mock('@react-oauth/google', () => ({
  GoogleOAuthProvider: ({ children }) => <div>{children}</div>
}));

describe('Index.js', () => {
  it('renders App inside GoogleOAuthProvider without crashing', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    const root = ReactDOM.createRoot(div);
    root.render(
      <React.StrictMode>
        <GoogleOAuthProvider clientId="test-client-id">
          <App />
        </GoogleOAuthProvider>
      </React.StrictMode>
    );

    expect(div).toBeTruthy(); // Smoke test to confirm render
  });
});
