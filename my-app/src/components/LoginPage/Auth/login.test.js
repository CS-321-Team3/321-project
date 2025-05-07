// src/userauth.test.js
import { userauth } from './login'; // Import from the actual file location
import { handleSignIn } from './login'; // Import from the actual file location
import { userauth } from './login';

// Mock the global fetch function
global.fetch = jest.fn();

describe('userauth Model Function', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });
  
  // STATEMENT COVERAGE: Tests the main success path through the function
  // Covers: FormData creation, fetch call, response handling, and return value
  it('should successfully authenticate and return user ID', async () => {
    // Mock a successful response
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: '123' })
    });
    
    const result = await userauth('testuser', 'correctpassword');
    
    // Check that fetch was called with correct parameters
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8000/login/',
      expect.objectContaining({
        method: 'POST',
        body: expect.any(FormData)
      })
    );
    
    // Verify the FormData contains correct values
    const formDataArg = global.fetch.mock.calls[0][1].body;
    expect(formDataArg.get('username')).toBe('testuser');
    expect(formDataArg.get('password')).toBe('correctpassword');
    
    // Check the returned user ID
    expect(result).toBe('123');
  });
  
  // BRANCH COVERAGE: Tests the condition where response.ok is false and error details exist
  // Covers: if (!response.ok) branch and error handling with error details
  it('should throw an error when response is not ok (HTTP error status)', async () => {
    // Mock a failed response with error details
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      json: async () => ({ detail: 'Invalid credentials' })
    });
    
    // Check that the promise rejects with the correct error
    await expect(userauth('testuser', 'wrongpassword')).rejects.toThrow('Invalid credentials');
  });
  
  // BRANCH COVERAGE: Tests the condition where response.ok is false and error details don't exist
  // Covers: if (!response.ok) branch and errorData.detail fallback path
  it('should throw an error when response is not ok and has no detail', async () => {
    // Mock a failed response without error details
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: async () => ({}) // Empty response
    });
    
    // Check that the promise rejects with the correct error
    await expect(userauth('testuser', 'password123')).rejects.toThrow('Error: 500 Internal Server Error');
  });
  
  // BRANCH COVERAGE: Tests the catch branch in the response.json() error handling
  // Covers: The catch block for the response.json() call
  it('should throw an error when response JSON cannot be parsed', async () => {
    // Mock a failed response with JSON parse error
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: async () => { throw new Error('Invalid JSON'); }
    });
    
    // Check that the promise rejects with the correct error
    await expect(userauth('testuser', 'password123')).rejects.toThrow('Error: 500 Internal Server Error');
  });
  
  // BRANCH COVERAGE: Tests the condition where response.ok is true but data.id is missing
  // Covers: if (!data.id) branch
  it('should throw an error when response is missing user ID', async () => {
    // Mock a successful response but without ID
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: 'abc123' }) // No ID field
    });
    
    // Check that the promise rejects with the correct error
    await expect(userauth('testuser', 'password123')).rejects.toThrow('Invalid response: missing user ID');
  });
  
  // BRANCH COVERAGE: Tests the catch block for network errors
  // Covers: The outer catch block that handles fetch rejections
  it('should throw an error when network request fails', async () => {
    // Mock a network error
    global.fetch.mockRejectedValueOnce(new Error('Network error'));
    
    // Check that the promise rejects with the correct error
    await expect(userauth('testuser', 'password123')).rejects.toThrow('Network error');
  });
});


// Mock dependencies
jest.mock('./login', () => {
  // Keep the original module
  const originalModule = jest.requireActual('./login');
  
  // Mock only the userauth function
  return {
    ...originalModule,
    userauth: jest.fn(),
  };
});

describe('handleSignIn Controller Function', () => {
  // Setup common test variables
  let mockEvent;
  let mockNavigate;
  let mockConsoleLog;
  let mockConsoleError;
  let credentials;
  
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Setup mock event with preventDefault
    mockEvent = { preventDefault: jest.fn() };
    
    // Setup mock navigate function
    mockNavigate = jest.fn();
    
    // Setup mock for console methods
    mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});
    mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Setup test credentials
    credentials = {
      username: 'testuser',
      password: 'password123'
    };
  });
  
  afterEach(() => {
    // Restore console methods
    mockConsoleLog.mockRestore();
    mockConsoleError.mockRestore();
  });
  
  // STATEMENT COVERAGE: Tests that preventDefault is called
  // Covers: e.preventDefault() statement
  it('should prevent default form submission', async () => {
    // Mock userauth to resolve
    userauth.mockResolvedValueOnce('123');
    
    // Call handleSignIn
    await handleSignIn(mockEvent, credentials, mockNavigate);
    
    // Check that preventDefault was called
    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });
  
  // STATEMENT COVERAGE: Tests that userauth is called with credentials
  // Covers: await userauth(credentials['username'], credentials['password']) statement
  it('should call userauth with correct credentials', async () => {
    // Mock userauth to resolve
    userauth.mockResolvedValueOnce('123');
    
    // Call handleSignIn
    await handleSignIn(mockEvent, credentials, mockNavigate);
    
    // Check that userauth was called with correct parameters
    expect(userauth).toHaveBeenCalledWith('testuser', 'password123');
  });
  
  // BRANCH COVERAGE: Tests the try block and successful authentication path
  // Covers: userId assignment, console.log and navigate statements
  it('should navigate to user page on successful authentication', async () => {
    // Mock userauth to resolve with user ID
    userauth.mockResolvedValueOnce('123');
    
    // Call handleSignIn
    await handleSignIn(mockEvent, credentials, mockNavigate);
    
    // Check that navigate was called with correct path
    expect(mockNavigate).toHaveBeenCalledWith('user/123');
    
    // Check that console.log was called with success message
    expect(mockConsoleLog).toHaveBeenCalledWith('Login successful, user ID:', '123');
  });
  
  // BRANCH COVERAGE: Tests the catch block path
  // Covers: attempts++ statement, console.error and console.log in catch block
  it('should increment attempts counter on failed authentication', async () => {
    // Mock userauth to reject
    userauth.mockRejectedValueOnce(new Error('Authentication failed'));
    
    // Call handleSignIn
    await handleSignIn(mockEvent, credentials, mockNavigate);
    
    // Check that console.error was called with error message
    expect(mockConsoleError).toHaveBeenCalledWith('Login failed:', 'Authentication failed');
    
    // Check that console.log was called with attempts count
    expect(mockConsoleLog).toHaveBeenCalledWith('attempts: ', 1);
  });
  
  // STATEMENT COVERAGE: Tests that attempts counter increments properly
  // Covers: Multiple executions of attempts++ to verify the counter works
  it('should properly track multiple failed attempts', async () => {
    // Mock userauth to reject multiple times
    userauth.mockRejectedValueOnce(new Error('First failure'));
    
    // First attempt
    await handleSignIn(mockEvent, credentials, mockNavigate);
    
    // Check attempts count after first failure
    expect(mockConsoleLog).toHaveBeenCalledWith('attempts: ', 1);
    
    // Second attempt
    userauth.mockRejectedValueOnce(new Error('Second failure'));
    await handleSignIn(mockEvent, credentials, mockNavigate);
    
    // Check attempts count after second failure
    expect(mockConsoleLog).toHaveBeenCalledWith('attempts: ', 2);
  });
  
  // BRANCH COVERAGE: Ensures that navigate isn't called in the error path
  // Covers: Verification that navigate is only called in success path
  it('should not navigate on authentication failure', async () => {
    // Mock userauth to reject
    userauth.mockRejectedValueOnce(new Error('Authentication failed'));
    
    // Call handleSignIn
    await handleSignIn(mockEvent, credentials, mockNavigate);
    
    // Check that navigate was not called
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});