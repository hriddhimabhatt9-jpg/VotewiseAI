/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Send: (props: any) => <svg data-testid="icon-send" {...props} />,
  Bot: (props: any) => <svg data-testid="icon-bot" {...props} />,
  User: (props: any) => <svg data-testid="icon-user" {...props} />,
  Loader2: (props: any) => <svg data-testid="icon-loader" {...props} />,
  Mic: (props: any) => <svg data-testid="icon-mic" {...props} />,
  MicOff: (props: any) => <svg data-testid="icon-mic-off" {...props} />,
  Volume2: (props: any) => <svg data-testid="icon-volume" {...props} />,
  VolumeX: (props: any) => <svg data-testid="icon-volume-x" {...props} />,
  Sparkles: (props: any) => <svg data-testid="icon-sparkles" {...props} />,
  MessageSquare: (props: any) => <svg data-testid="icon-msg" {...props} />,
  Trash2: (props: any) => <svg data-testid="icon-trash" {...props} />,
}));

import ChatWindow from '../ChatWindow';

describe('ChatWindow Component', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders with default greeting', () => {
    render(<ChatWindow />);
    expect(screen.getByText(/VoteWise AI Assistant/)).toBeInTheDocument();
  });

  it('renders with custom greeting', () => {
    render(<ChatWindow greeting="Custom hello message" />);
    expect(screen.getByText(/Custom hello message/)).toBeInTheDocument();
  });

  it('renders the chat header', () => {
    render(<ChatWindow />);
    expect(screen.getByText('VoteWise AI')).toBeInTheDocument();
    expect(screen.getByText(/Online/)).toBeInTheDocument();
  });

  it('renders quick suggestions initially', () => {
    render(<ChatWindow />);
    expect(screen.getByText('How do I register to vote?')).toBeInTheDocument();
    expect(screen.getByText('Where is my polling booth?')).toBeInTheDocument();
  });

  it('renders input field and send button', () => {
    render(<ChatWindow />);
    expect(screen.getByLabelText('Type your message')).toBeInTheDocument();
    expect(screen.getByLabelText('Send message')).toBeInTheDocument();
  });

  it('disables send button when input is empty', () => {
    render(<ChatWindow />);
    const sendBtn = screen.getByLabelText('Send message');
    expect(sendBtn).toBeDisabled();
  });

  it('sends a message and shows loading', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve({ content: 'AI response here' }),
    });

    render(<ChatWindow />);
    const input = screen.getByLabelText('Type your message');
    const sendBtn = screen.getByLabelText('Send message');

    await userEvent.type(input, 'How do I vote?');
    expect(sendBtn).not.toBeDisabled();

    fireEvent.click(sendBtn);

    // User message should appear
    await waitFor(() => {
      expect(screen.getByText('How do I vote?')).toBeInTheDocument();
    });

    // AI response should appear eventually
    await waitFor(() => {
      expect(screen.getByText(/AI response here/)).toBeInTheDocument();
    });
  });

  it('handles API error gracefully', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    render(<ChatWindow />);
    const input = screen.getByLabelText('Type your message');

    await userEvent.type(input, 'Test message');
    fireEvent.submit(input.closest('form')!);

    await waitFor(() => {
      expect(screen.getByText(/trouble connecting/)).toBeInTheDocument();
    });
  });

  it('has clear chat button with proper aria-label', () => {
    render(<ChatWindow />);
    expect(screen.getByLabelText('Clear chat history')).toBeInTheDocument();
  });

  it('has voice input button with proper aria-label', () => {
    render(<ChatWindow />);
    expect(screen.getByLabelText('Start voice input')).toBeInTheDocument();
  });

  it('renders chat messages region with ARIA live', () => {
    render(<ChatWindow />);
    const log = screen.getByRole('log');
    expect(log).toHaveAttribute('aria-live', 'polite');
  });
});
