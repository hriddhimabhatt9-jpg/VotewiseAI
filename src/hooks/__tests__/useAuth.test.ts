/**
 * Tests for useAuth hook
 */

import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../useAuth';
import toast from 'react-hot-toast';

// Mock Firebase auth
jest.mock('firebase/auth', () => ({
  onAuthStateChanged: jest.fn((_auth, callback) => {
    callback(null);
    return jest.fn();
  }),
  signInWithEmailAndPassword: jest.fn().mockResolvedValue({ user: { uid: '123' } }),
  createUserWithEmailAndPassword: jest.fn().mockResolvedValue({
    user: { uid: '123', email: 'test@test.com', displayName: null, photoURL: null },
  }),
  signInWithPopup: jest.fn().mockResolvedValue({ user: { uid: 'g123' } }),
  signOut: jest.fn().mockResolvedValue(undefined),
  updateProfile: jest.fn().mockResolvedValue(undefined),
  GoogleAuthProvider: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn().mockResolvedValue({ exists: () => false }),
  setDoc: jest.fn().mockResolvedValue(undefined),
  updateDoc: jest.fn().mockResolvedValue(undefined),
  serverTimestamp: jest.fn(() => new Date()),
}));

describe('useAuth', () => {
  it('initializes with loading state', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.loading).toBeDefined();
  });

  it('provides login function', () => {
    const { result } = renderHook(() => useAuth());
    expect(typeof result.current.login).toBe('function');
  });

  it('provides signup function', () => {
    const { result } = renderHook(() => useAuth());
    expect(typeof result.current.signup).toBe('function');
  });

  it('provides logout function', () => {
    const { result } = renderHook(() => useAuth());
    expect(typeof result.current.logout).toBe('function');
  });

  it('provides loginWithGoogle function', () => {
    const { result } = renderHook(() => useAuth());
    expect(typeof result.current.loginWithGoogle).toBe('function');
  });

  it('provides updateUserProfile function', () => {
    const { result } = renderHook(() => useAuth());
    expect(typeof result.current.updateUserProfile).toBe('function');
  });

  it('demo login works', async () => {
    const { result } = renderHook(() => useAuth());
    await act(async () => {
      await result.current.login('demo@test.com', 'password');
    });
    expect(toast.success).toHaveBeenCalled();
  });

  it('demo signup works', async () => {
    const { result } = renderHook(() => useAuth());
    await act(async () => {
      await result.current.signup('demo@test.com', 'password', 'Demo User');
    });
    expect(toast.success).toHaveBeenCalled();
  });

  it('demo Google login works', async () => {
    const { result } = renderHook(() => useAuth());
    await act(async () => {
      await result.current.loginWithGoogle();
    });
    expect(toast.success).toHaveBeenCalled();
  });

  it('demo logout works', async () => {
    const { result } = renderHook(() => useAuth());
    await act(async () => {
      await result.current.logout();
    });
    expect(toast.success).toHaveBeenCalled();
  });
});
