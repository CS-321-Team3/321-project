import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import JobResults from './JobResults';

describe('JobResults Component', () => {
  const mockOnPrepare = jest.fn();

  const mockJobs = [
    {
      _id: '1',
      jobname: 'Software Engineer',
      job_description: 'Work with frontend and backend technologies.'
    },
    {
      _id: '2',
      jobname: 'Data Analyst',
      job_description: 'Analyze datasets and generate reports.'
    }
  ];

  it('shows loading spinner when isLoading is true', () => {
    render(<JobResults results={[]} isLoading={true} onPrepare={mockOnPrepare} />);
    expect(screen.getByText(/Searching for jobs/i)).toBeInTheDocument();
  });

  it('shows no results message when results are empty', () => {
    render(<JobResults results={[]} isLoading={false} onPrepare={mockOnPrepare} />);
    expect(screen.getByText(/No jobs found/i)).toBeInTheDocument();
  });

  it('renders job cards when results are provided', () => {
    render(<JobResults results={mockJobs} isLoading={false} onPrepare={mockOnPrepare} />);
    expect(screen.getByText(/Software Engineer/i)).toBeInTheDocument();
    expect(screen.getByText(/Data Analyst/i)).toBeInTheDocument();
  });

  it('calls onPrepare when Prepare! button is clicked', () => {
    render(<JobResults results={mockJobs} isLoading={false} onPrepare={mockOnPrepare} />);
    const prepareButtons = screen.getAllByText(/Prepare!/i);
    fireEvent.click(prepareButtons[0]);
    expect(mockOnPrepare).toHaveBeenCalledWith(mockJobs[0]);
  });
});
