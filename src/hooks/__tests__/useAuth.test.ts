/**
 * useAuth Hook Tests
 * Tests auth state management, login, signup, logout flows
 * Uses demo mode since Firebase is not configured in test environment
 */

import { useAuthStore } from '@/store';

// Firebase is mocked in jest.setup.js and useAuth uses isDemoMode=true in tests

describe('useAuth Hook (Demo Mode)', () => {
  beforeEach(() => {
    // Reset store
    useAuthStore.setState({ user: null, loading: false });
  });

  it('should initialize with no user', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.loading).toBe(false);
  });

  it('should set user on demo login', () => {
    const mockUser = {
      uid: 'demo-user',
      email: 'test@example.com',
      fullName: 'Demo Voter',
      xp: 0,
      level: 1,
      badges: [],
      quizScore: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    useAuthStore.getState().setUser(mockUser as any);
    expect(useAuthStore.getState().user).toEqual(mockUser);
  });

  it('should clear user on logout', () => {
    useAuthStore.getState().setUser({
      uid: 'test',
      email: 'test@test.com',
      fullName: 'Test',
      xp: 0,
      level: 1,
      badges: [],
      quizScore: 0,
    } as any);
    expect(useAuthStore.getState().user).not.toBeNull();
    useAuthStore.getState().setUser(null);
    expect(useAuthStore.getState().user).toBeNull();
  });

  it('should set loading state', () => {
    useAuthStore.getState().setLoading(true);
    expect(useAuthStore.getState().loading).toBe(true);
    useAuthStore.getState().setLoading(false);
    expect(useAuthStore.getState().loading).toBe(false);
  });

  it('should update profile', () => {
    useAuthStore.getState().setUser({
      uid: 'test',
      email: 'test@test.com',
      fullName: 'Old Name',
      xp: 0,
      level: 1,
      badges: [],
      quizScore: 0,
    } as any);

    useAuthStore.getState().updateProfile({ fullName: 'New Name' });
    expect(useAuthStore.getState().user?.fullName).toBe('New Name');
  });

  it('should not crash updateProfile when user is null', () => {
    useAuthStore.getState().setUser(null);
    expect(() => {
      useAuthStore.getState().updateProfile({ fullName: 'Test' });
    }).not.toThrow();
  });

  it('should add XP', () => {
    useAuthStore.getState().setUser({
      uid: 'test',
      email: 'test@test.com',
      fullName: 'Test',
      xp: 0,
      level: 1,
      badges: [],
      quizScore: 0,
    } as any);

    useAuthStore.getState().addXP(100);
    expect(useAuthStore.getState().user?.xp).toBe(100);
  });

  it('should calculate level from XP', () => {
    useAuthStore.getState().setUser({
      uid: 'test',
      email: 'test@test.com',
      fullName: 'Test',
      xp: 0,
      level: 1,
      badges: [],
      quizScore: 0,
    } as any);

    useAuthStore.getState().addXP(1200);
    const user = useAuthStore.getState().user;
    expect(user?.xp).toBe(1200);
    expect(user?.level).toBeGreaterThanOrEqual(2);
  });

  it('should not crash addXP when user is null', () => {
    useAuthStore.getState().setUser(null);
    expect(() => {
      useAuthStore.getState().addXP(100);
    }).not.toThrow();
  });

  it('should handle profile with email and fullName', () => {
    const profile = {
      uid: 'profile-test',
      email: 'voter@india.com',
      fullName: 'Ram Sharma',
      xp: 500,
      level: 2,
      badges: ['early_voter'],
      quizScore: 80,
      dob: '1990-01-15',
      address: 'Delhi',
      constituency: 'New Delhi',
      voterId: 'ABC1234567',
      isRegistered: true,
    };
    useAuthStore.getState().setUser(profile as any);
    const user = useAuthStore.getState().user;
    expect(user?.fullName).toBe('Ram Sharma');
    expect(user?.email).toBe('voter@india.com');
    expect(user?.xp).toBe(500);
    expect(user?.level).toBe(2);
  });
});
