/**
 * Tests for Navbar component
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Navbar } from '../Navbar';

// Mock the stores
jest.mock('@/store', () => ({
  useAuthStore: jest.fn(() => ({
    user: null,
    loading: false,
  })),
  useLangStore: jest.fn(() => ({
    lang: 'en',
    toggleLang: jest.fn(),
  })),
  useNotificationStore: jest.fn(() => ({
    unreadCount: 3,
    setUnreadCount: jest.fn(),
  })),
}));

jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    logout: jest.fn(),
  }),
}));

describe('Navbar', () => {
  it('renders the navbar', () => {
    render(<Navbar />);
    expect(screen.getByText('VoteWise AI+')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<Navbar />);
    // Check for nav element
    const nav = document.querySelector('nav');
    expect(nav).toBeInTheDocument();
  });

  it('renders login link when not authenticated', () => {
    render(<Navbar />);
    // Should show login/signup links when no user
    const loginLink = screen.queryByText(/login/i) || screen.queryByText(/Sign In/i) || screen.queryByText(/Get Started/i);
    expect(loginLink || document.querySelector('a[href="/login"]')).toBeTruthy();
  });
});
