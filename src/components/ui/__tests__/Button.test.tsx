import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button Component', () => {
  it('should render children', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('should render as button element', () => {
    render(<Button>Test</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should handle click events', () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Click</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is set', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should be disabled when loading', () => {
    render(<Button isLoading>Loading</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should show loading spinner when loading', () => {
    render(<Button isLoading>Submit</Button>);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should set aria-busy when loading', () => {
    render(<Button isLoading>Submit</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
  });

  it('should support aria-label', () => {
    render(<Button aria-label="Submit form">→</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Submit form');
  });

  it('should apply variant classes', () => {
    const { container } = render(<Button variant="danger">Delete</Button>);
    const button = container.querySelector('button');
    expect(button?.className).toContain('from-red-500');
  });

  it('should apply size classes', () => {
    const { container } = render(<Button size="lg">Large</Button>);
    const button = container.querySelector('button');
    expect(button?.className).toContain('px-8');
  });

  it('should support custom className', () => {
    const { container } = render(<Button className="custom-class">Test</Button>);
    const button = container.querySelector('button');
    expect(button?.className).toContain('custom-class');
  });

  it('should support type attribute', () => {
    render(<Button type="submit">Submit</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });
});
