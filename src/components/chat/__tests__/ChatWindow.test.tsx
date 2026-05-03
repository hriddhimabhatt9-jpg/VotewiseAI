/**
 * Tests for ChatWindow component
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChatWindow from '../ChatWindow';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('ChatWindow', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('renders greeting message', () => {
    render(<ChatWindow greeting="Hello test!" />);
    expect(screen.getByText('Hello test!')).toBeInTheDocument();
  });

  it('renders default greeting', () => {
    render(<ChatWindow />);
    expect(screen.getByText(/VoteWise AI Assistant/)).toBeInTheDocument();
  });

  it('renders input field', () => {
    render(<ChatWindow />);
    expect(screen.getByLabelText('Type your message')).toBeInTheDocument();
  });

  it('renders send button', () => {
    render(<ChatWindow />);
    expect(screen.getByLabelText('Send message')).toBeInTheDocument();
  });

  it('renders voice input button', () => {
    render(<ChatWindow />);
    expect(screen.getByLabelText('Start voice input')).toBeInTheDocument();
  });

  it('renders clear chat button', () => {
    render(<ChatWindow />);
    expect(screen.getByLabelText('Clear chat history')).toBeInTheDocument();
  });

  it('renders quick suggestions', () => {
    render(<ChatWindow />);
    expect(screen.getByText('How do I register to vote?')).toBeInTheDocument();
    expect(screen.getByText('Where is my polling booth?')).toBeInTheDocument();
  });

  it('disables send when input is empty', () => {
    render(<ChatWindow />);
    const sendButton = screen.getByLabelText('Send message');
    expect(sendButton).toBeDisabled();
  });

  it('enables send when input has text', async () => {
    render(<ChatWindow />);
    const input = screen.getByLabelText('Type your message');
    await userEvent.type(input, 'Hello');
    const sendButton = screen.getByLabelText('Send message');
    expect(sendButton).not.toBeDisabled();
  });

  it('sends message on submit', async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ content: 'AI reply', role: 'assistant' }),
    });

    render(<ChatWindow />);
    const input = screen.getByLabelText('Type your message');
    await userEvent.type(input, 'Test message');
    fireEvent.submit(input.closest('form')!);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  it('handles API error gracefully', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    render(<ChatWindow />);
    const input = screen.getByLabelText('Type your message');
    await userEvent.type(input, 'Test');
    fireEvent.submit(input.closest('form')!);

    await waitFor(() => {
      expect(screen.getByText(/trouble connecting/i)).toBeInTheDocument();
    });
  });

  it('clears chat on clear button click', async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ content: 'Reply!', role: 'assistant' }),
    });

    render(<ChatWindow greeting="Greeting msg" />);
    const input = screen.getByLabelText('Type your message');
    await userEvent.type(input, 'Message');
    fireEvent.submit(input.closest('form')!);

    await waitFor(() => {
      expect(screen.getByText('Message')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText('Clear chat history'));
    expect(screen.getByText('Greeting msg')).toBeInTheDocument();
  });

  it('sets suggestion text on click', async () => {
    render(<ChatWindow />);
    fireEvent.click(screen.getByText('How do I register to vote?'));
    const input = screen.getByLabelText('Type your message') as HTMLInputElement;
    expect(input.value).toBe('How do I register to vote?');
  });

  it('renders header with VoteWise AI title', () => {
    render(<ChatWindow />);
    expect(screen.getByText('VoteWise AI')).toBeInTheDocument();
  });

  it('shows chat log area with correct aria attributes', () => {
    render(<ChatWindow />);
    const log = screen.getByRole('log');
    expect(log).toHaveAttribute('aria-label', 'Chat messages');
  });

  it('accepts compact mode prop', () => {
    const { container } = render(<ChatWindow compact />);
    expect(container.firstChild).toHaveClass('max-h-[600px]');
  });
});
