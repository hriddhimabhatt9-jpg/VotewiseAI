import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input, Textarea } from '../Input';

describe('Input Component', () => {
  it('should render with label', () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('should link label to input via htmlFor', () => {
    render(<Input label="Email" id="email-input" />);
    const input = screen.getByLabelText('Email');
    expect(input.id).toBe('email-input');
  });

  it('should auto-generate id when not provided', () => {
    render(<Input label="Name" />);
    const input = screen.getByLabelText('Name');
    expect(input.id).toBeTruthy();
  });

  it('should display error message', () => {
    render(<Input label="Email" error="Email is required" />);
    expect(screen.getByText('Email is required')).toBeInTheDocument();
  });

  it('should set aria-invalid when error present', () => {
    render(<Input label="Email" error="Invalid email" />);
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('should set aria-describedby to error id', () => {
    render(<Input label="Email" id="email" error="Required" />);
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('aria-describedby', 'email-error');
  });

  it('should show error with role="alert"', () => {
    render(<Input label="Email" error="Required" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('should render icon', () => {
    render(<Input label="Search" icon={<span data-testid="icon">🔍</span>} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('should accept text input', () => {
    render(<Input label="Name" />);
    const input = screen.getByLabelText('Name') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'John' } });
    expect(input.value).toBe('John');
  });

  it('should render placeholder', () => {
    render(<Input label="Email" placeholder="you@example.com" />);
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
  });

  it('should support disabled state', () => {
    render(<Input label="Email" disabled />);
    expect(screen.getByLabelText('Email')).toBeDisabled();
  });

  it('should support type attribute', () => {
    render(<Input label="Password" type="password" />);
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password');
  });

  it('should not have aria-invalid without error', () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText('Email')).not.toHaveAttribute('aria-invalid');
  });
});

describe('Textarea Component', () => {
  it('should render with label', () => {
    render(<Textarea label="Message" />);
    expect(screen.getByLabelText('Message')).toBeInTheDocument();
  });

  it('should display error message', () => {
    render(<Textarea label="Message" error="Message is required" />);
    expect(screen.getByText('Message is required')).toBeInTheDocument();
  });

  it('should set aria-invalid when error present', () => {
    render(<Textarea label="Message" error="Required" />);
    expect(screen.getByLabelText('Message')).toHaveAttribute('aria-invalid', 'true');
  });

  it('should accept text input', () => {
    render(<Textarea label="Notes" />);
    const textarea = screen.getByLabelText('Notes') as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'Test note' } });
    expect(textarea.value).toBe('Test note');
  });
});
