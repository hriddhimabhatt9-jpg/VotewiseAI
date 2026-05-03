import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '../page';

// Mock Link component
jest.mock('next/link', () => {
  return function MockLink({ children, href, ...props }: any) {
    return <a href={href} {...props}>{children}</a>;
  };
});

describe('Landing Page', () => {
  it('should render the hero section', () => {
    render(<Home />);
    expect(screen.getByText(/Vote Smart with/)).toBeInTheDocument();
    expect(screen.getByText('VoteWise AI+')).toBeInTheDocument();
  });

  it('should render the CTA buttons', () => {
    render(<Home />);
    expect(screen.getByText(/Get Started Now/)).toBeInTheDocument();
    expect(screen.getByText(/Watch Demo/)).toBeInTheDocument();
  });

  it('should have signup link', () => {
    render(<Home />);
    const getStartedLink = screen.getByText(/Get Started Now/).closest('a');
    expect(getStartedLink).toHaveAttribute('href', '/signup');
  });

  it('should render the features section', () => {
    render(<Home />);
    expect(screen.getByText('AI Election Assistant')).toBeInTheDocument();
    expect(screen.getByText('Candidate Intelligence')).toBeInTheDocument();
    expect(screen.getByText('Fake News Detection')).toBeInTheDocument();
    expect(screen.getByText('Voting Simulator')).toBeInTheDocument();
  });

  it('should render feature descriptions', () => {
    render(<Home />);
    expect(screen.getByText(/voting questions/)).toBeInTheDocument();
    expect(screen.getByText(/candidate backgrounds/)).toBeInTheDocument();
  });

  it('should render the CTA section', () => {
    render(<Home />);
    expect(screen.getByText(/Ready to make your vote count/)).toBeInTheDocument();
    expect(screen.getByText('Create Free Account')).toBeInTheDocument();
  });

  it('should render the AI companion badge', () => {
    render(<Home />);
    expect(screen.getByText('Your AI-Powered Civic Companion')).toBeInTheDocument();
  });

  it('should have features section with id', () => {
    const { container } = render(<Home />);
    const featuresSection = container.querySelector('#features');
    expect(featuresSection).toBeInTheDocument();
  });

  it('should have informed voter heading', () => {
    render(<Home />);
    expect(screen.getByText(/Everything you need/)).toBeInTheDocument();
    expect(screen.getByText(/informed voter/)).toBeInTheDocument();
  });
});
