import React from 'react';
import { render, screen } from '@testing-library/react';
import { Footer } from '../Footer';

describe('Footer Component', () => {
  it('should render the brand name', () => {
    render(<Footer />);
    expect(screen.getByText('VoteWise AI+')).toBeInTheDocument();
  });

  it('should have contentinfo role', () => {
    render(<Footer />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });

  it('should have aria-label', () => {
    render(<Footer />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveAttribute('aria-label', 'Site footer');
  });

  it('should render the features section', () => {
    render(<Footer />);
    expect(screen.getByText('Features')).toBeInTheDocument();
    expect(screen.getByText('AI Chatbot')).toBeInTheDocument();
    expect(screen.getByText('Candidate Info')).toBeInTheDocument();
    expect(screen.getByText('Vote Planner')).toBeInTheDocument();
  });

  it('should render the resources section', () => {
    render(<Footer />);
    expect(screen.getByText('Resources')).toBeInTheDocument();
    expect(screen.getByText('Voter Registration')).toBeInTheDocument();
    expect(screen.getByText('Election Calendar')).toBeInTheDocument();
  });

  it('should render the legal section', () => {
    render(<Footer />);
    expect(screen.getByText('Legal')).toBeInTheDocument();
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText('Terms of Service')).toBeInTheDocument();
  });

  it('should display copyright with current year', () => {
    render(<Footer />);
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
  });

  it('should render "Made with ❤ for democracy"', () => {
    render(<Footer />);
    expect(screen.getByText(/Made with/)).toBeInTheDocument();
    expect(screen.getByText(/for democracy/)).toBeInTheDocument();
  });
});
