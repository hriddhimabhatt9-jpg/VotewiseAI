/**
 * Tests for Zustand stores
 */

import { useAuthStore, useThemeStore, useNotificationStore, useLangStore } from '../index';

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, loading: true });
  });

  it('initializes with null user and loading true', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.loading).toBe(true);
  });

  it('sets user', () => {
    const mockUser = {
      uid: '123',
      email: 'test@test.com',
      fullName: 'Test User',
      xp: 0,
      level: 1,
      badges: [],
      quizScore: 0,
      isRegistered: false,
      dob: '',
      mobile: '',
      address: '',
      constituency: '',
      voterId: '',
      interests: [],
      language: 'en',
      accessibilityNeeds: '',
      photoURL: '',
      createdAt: '',
      updatedAt: '',
    };
    useAuthStore.getState().setUser(mockUser);
    expect(useAuthStore.getState().user).toEqual(mockUser);
  });

  it('sets loading', () => {
    useAuthStore.getState().setLoading(false);
    expect(useAuthStore.getState().loading).toBe(false);
  });

  it('updates profile', () => {
    const mockUser = {
      uid: '123', email: 'a@b.com', fullName: 'A', xp: 0, level: 1,
      badges: [], quizScore: 0, isRegistered: false, dob: '', mobile: '',
      address: '', constituency: '', voterId: '', interests: [],
      language: 'en', accessibilityNeeds: '', photoURL: '', createdAt: '', updatedAt: '',
    };
    useAuthStore.getState().setUser(mockUser);
    useAuthStore.getState().updateProfile({ fullName: 'Updated' });
    expect(useAuthStore.getState().user?.fullName).toBe('Updated');
  });

  it('updateProfile does nothing when user is null', () => {
    useAuthStore.getState().updateProfile({ fullName: 'X' });
    expect(useAuthStore.getState().user).toBeNull();
  });

  it('adds XP and calculates level', () => {
    const mockUser = {
      uid: '1', email: '', fullName: '', xp: 0, level: 1,
      badges: [], quizScore: 0, isRegistered: false, dob: '', mobile: '',
      address: '', constituency: '', voterId: '', interests: [],
      language: 'en', accessibilityNeeds: '', photoURL: '', createdAt: '', updatedAt: '',
    };
    useAuthStore.getState().setUser(mockUser);
    useAuthStore.getState().addXP(600);
    const state = useAuthStore.getState();
    expect(state.user?.xp).toBe(600);
    expect(state.user?.level).toBe(2);
  });

  it('addXP does nothing when user is null', () => {
    useAuthStore.getState().addXP(100);
    expect(useAuthStore.getState().user).toBeNull();
  });
});

describe('useThemeStore', () => {
  beforeEach(() => {
    useThemeStore.setState({ theme: 'light' });
  });

  it('initializes with light theme', () => {
    expect(useThemeStore.getState().theme).toBe('light');
  });

  it('toggles theme', () => {
    useThemeStore.getState().toggleTheme();
    expect(useThemeStore.getState().theme).toBe('dark');
    useThemeStore.getState().toggleTheme();
    expect(useThemeStore.getState().theme).toBe('light');
  });

  it('sets theme directly', () => {
    useThemeStore.getState().setTheme('dark');
    expect(useThemeStore.getState().theme).toBe('dark');
  });
});

describe('useNotificationStore', () => {
  it('initializes with unread count 3', () => {
    expect(useNotificationStore.getState().unreadCount).toBe(3);
  });

  it('sets unread count', () => {
    useNotificationStore.getState().setUnreadCount(5);
    expect(useNotificationStore.getState().unreadCount).toBe(5);
  });
});

describe('useLangStore', () => {
  beforeEach(() => {
    useLangStore.setState({ lang: 'en' });
  });

  it('initializes with en', () => {
    expect(useLangStore.getState().lang).toBe('en');
  });

  it('sets language', () => {
    useLangStore.getState().setLang('hi');
    expect(useLangStore.getState().lang).toBe('hi');
  });

  it('toggles language', () => {
    useLangStore.getState().toggleLang();
    expect(useLangStore.getState().lang).toBe('hi');
    useLangStore.getState().toggleLang();
    expect(useLangStore.getState().lang).toBe('en');
  });
});
