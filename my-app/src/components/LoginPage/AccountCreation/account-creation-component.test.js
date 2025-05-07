import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AccountCreation, { signup } from './account-creation-component';
import { useNavigate } from 'react-router-dom';

// Mock react-router-dom's useNavigate
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

// Mock fetch API
global.fetch = jest.fn();
global.FormData = jest.fn(() => ({
  append: jest.fn(),
}));

describe('signup function (Model)', () => {
  beforeEach(() => {
    fetch.mockClear();
    FormData.mockClear();
    console.log = jest.fn();
  });

  // STATEMENT COVERAGE: Tests the basic execution flow through the signup function
  // Covers: Function declaration, variable assignment, FormData creation,
  // fetch call, response handling, and successful return
  test('should successfully signup with valid credentials', async () => {
    // Mock successful fetch response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ status: 200 }),
    });

    await expect(signup('testUser', 'password123', 'test@example.com')).resolves.not.toThrow();
    
    // Verify FormData was used correctly
    expect(FormData).toHaveBeenCalled();
    const formDataInstance = FormData.mock.instances[0];
    expect(formDataInstance.append).toHaveBeenCalledWith('username', 'testUser');
    expect(formDataInstance.append).toHaveBeenCalledWith('password', 'password123');
    expect(formDataInstance.append).toHaveBeenCalledWith('email', 'test@example.com');
    
    // Verify fetch was called with the right arguments
    expect(fetch).toHaveBeenCalledWith('http://localhost:8000/signup/', {
      method: 'POST',
      body: expect.any(Object),
    });

    // Verify console.log was called with the credentials
    expect(console.log).toHaveBeenCalledWith('testUser', 'password123', 'test@example.com');
  });

  // BRANCH COVERAGE: Tests the branch where response.ok is false
  // Covers: if (!response.ok) branch and the errorData.detail path
  test('should throw error when response is not ok', async () => {
    // Mock fetch response that is not ok
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      json: () => Promise.resolve({ detail: 'Username already exists' }),
    });

    await expect(signup('existingUser', 'password123', 'test@example.com'))
      .rejects
      .toThrow('Username already exists');
  });

  // BRANCH COVERAGE: Tests branch where response.ok is false and there's no detail in error data
  // Covers: if (!response.ok) branch and the fallback error message path
  test('should throw error when response is not ok with no detail in error data', async () => {
    // Mock fetch response that is not ok with no detailed error
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: () => Promise.resolve({}),
    });

    await expect(signup('testUser', 'password123', 'test@example.com'))
      .rejects
      .toThrow('Error: 500 Internal Server Error');
  });

  // BRANCH COVERAGE: Tests the error catching branch when JSON parsing fails
  // Covers: response.json().catch(() => ({})) error branch
  test('should throw error when response json parsing fails', async () => {
    // Mock fetch response where json parsing fails
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: () => Promise.reject(new Error('Invalid JSON')),
    });

    await expect(signup('testUser', 'password123', 'test@example.com'))
      .rejects
      .toThrow('Error: 500 Internal Server Error');
  });

  // BRANCH COVERAGE: Tests the branch where status is not 200 in response body
  // Covers: if (!(data.status === 200)) branch
  test('should throw error when response status is not 200', async () => {
    // Mock fetch response with non-200 status in the response body
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ status: 400, message: 'Bad Request' }),
    });

    await expect(signup('testUser', 'password123', 'test@example.com'))
      .rejects
      .toThrow('Something went wrong');
  });

  // BRANCH COVERAGE: Tests the catch block in signup function
  // Covers: catch (error) branch and error re-throw
  test('should throw error when fetch fails', async () => {
    // Mock fetch failing completely
    fetch.mockRejectedValueOnce(new Error('Network error'));

    await expect(signup('testUser', 'password123', 'test@example.com'))
      .rejects
      .toThrow('Network error');
  });
});

describe('AccountCreation Component (Controller and View)', () => {
  let mockNavigate;

  beforeEach(() => {
    fetch.mockClear();
    mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
    console.log = jest.fn();
  });

  // STATEMENT COVERAGE: Tests component rendering
  // Covers: Component function declaration, return statement, JSX elements
  test('should render account creation form', () => {
    render(<AccountCreation />);
    
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email Address')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  // STATEMENT COVERAGE: Tests state management functionality
  // Covers: useState hook, handleCredentialChange function
  test('should update state when input values change', () => {
    render(<AccountCreation />);
    
    const usernameInput = screen.getByPlaceholderText('Username');
    const passwordInput = screen.getByPlaceholderText('Password');
    const emailInput = screen.getByPlaceholderText('Email Address');
    
    fireEvent.change(usernameInput, { target: { value: 'newUser' } });
    fireEvent.change(passwordInput, { target: { value: 'newPass' } });
    fireEvent.change(emailInput, { target: { value: 'new@example.com' } });
    
    expect(usernameInput.value).toBe('newUser');
    expect(passwordInput.value).toBe('newPass');
    expect(emailInput.value).toBe('new@example.com');
  });

  // BRANCH COVERAGE: Tests successful form submission branch
  // Covers: handleSubmit function try block and successful path
  test('should call signup and navigate on successful form submission', async () => {
    // Mock successful signup
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ status: 200 }),
    });

    render(<AccountCreation />);
    
    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText('Username'), { 
      target: { name: 'username', value: 'testUser' } 
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), { 
      target: { name: 'password', value: 'password123' } 
    });
    fireEvent.change(screen.getByPlaceholderText('Email Address'), { 
      target: { name: 'email', value: 'test@example.com' } 
    });
    
    // Submit the form
    fireEvent.submit(screen.getByRole('button', { name: /create account/i }));
    
    // Wait for async operations to complete
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenCalledWith('successfully created new account');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  // BRANCH COVERAGE: Tests error handling branch in form submission
  // Covers: handleSubmit function catch block
  test('should handle errors on form submission', async () => {
    // Mock failed signup
    const mockError = new Error('Signup failed');
    fetch.mockRejectedValueOnce(mockError);

    render(<AccountCreation />);
    
    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText('Username'), { 
      target: { name: 'username', value: 'testUser' } 
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), { 
      target: { name: 'password', value: 'password123' } 
    });
    fireEvent.change(screen.getByPlaceholderText('Email Address'), { 
      target: { name: 'email', value: 'test@example.com' } 
    });
    
    // Submit the form
    fireEvent.submit(screen.getByRole('button', { name: /create account/i }));
    
    // Wait for async operations to complete
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenCalledWith(mockError);
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});