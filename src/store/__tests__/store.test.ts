import { useAuthStore, useThemeStore, useNotificationStore, useLangStore } from '../index';

describe('Zustand Stores', () => {
  describe('useAuthStore', () => {
    beforeEach(() => {
      useAuthStore.setState({ user: null, loading: true });
    });

    it('should start with null user and loading true', () => {
      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.loading).toBe(true);
    });

    it('should set user', () => {
      const mockUser = {
        uid: 'test-123',
        email: 'test@example.com',
        fullName: 'Test User',
        xp: 100,
        level: 1,
        badges: [],
        quizScore: 50,
        dob: '1990-01-01',
        mobile: '9876543210',
        address: 'Delhi',
        constituency: 'Test',
        voterId: 'ABC1234567',
        isRegistered: true,
        interests: [],
        language: 'en',
        accessibilityNeeds: '',
        photoURL: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      useAuthStore.getState().setUser(mockUser);
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
      useAuthStore.getState().setUser(null);
      expect(useAuthStore.getState().user).toBeNull();
    });

    it('should set loading state', () => {
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
      useAuthStore.getState().updateProfile({ fullName: 'Test' });
      expect(useAuthStore.getState().user).toBeNull();
    });

    it('should add XP and calculate level', () => {
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

      useAuthStore.getState().addXP(500);
      expect(useAuthStore.getState().user?.xp).toBe(600);
      expect(useAuthStore.getState().user?.level).toBe(2); // 600/500 = 1.2, floor + 1 = 2
    });

    it('should not crash addXP when user is null', () => {
      useAuthStore.getState().setUser(null);
      useAuthStore.getState().addXP(100);
      expect(useAuthStore.getState().user).toBeNull();
    });
  });

  describe('useThemeStore', () => {
    beforeEach(() => {
      useThemeStore.setState({ theme: 'light' });
    });

    it('should start with light theme', () => {
      expect(useThemeStore.getState().theme).toBe('light');
    });

    it('should toggle to dark', () => {
      useThemeStore.getState().toggleTheme();
      expect(useThemeStore.getState().theme).toBe('dark');
    });

    it('should toggle back to light', () => {
      useThemeStore.getState().toggleTheme();
      useThemeStore.getState().toggleTheme();
      expect(useThemeStore.getState().theme).toBe('light');
    });

    it('should set theme directly', () => {
      useThemeStore.getState().setTheme('dark');
      expect(useThemeStore.getState().theme).toBe('dark');
    });
  });

  describe('useNotificationStore', () => {
    it('should start with 3 unread (demo)', () => {
      expect(useNotificationStore.getState().unreadCount).toBe(3);
    });

    it('should set unread count', () => {
      useNotificationStore.getState().setUnreadCount(0);
      expect(useNotificationStore.getState().unreadCount).toBe(0);
    });

    it('should handle large counts', () => {
      useNotificationStore.getState().setUnreadCount(99);
      expect(useNotificationStore.getState().unreadCount).toBe(99);
    });
  });

  describe('useLangStore', () => {
    beforeEach(() => {
      useLangStore.setState({ lang: 'en' });
    });

    it('should start with English', () => {
      expect(useLangStore.getState().lang).toBe('en');
    });

    it('should toggle to Hindi', () => {
      useLangStore.getState().toggleLang();
      expect(useLangStore.getState().lang).toBe('hi');
    });

    it('should toggle back to English', () => {
      useLangStore.getState().toggleLang();
      useLangStore.getState().toggleLang();
      expect(useLangStore.getState().lang).toBe('en');
    });

    it('should set language directly', () => {
      useLangStore.getState().setLang('hi');
      expect(useLangStore.getState().lang).toBe('hi');
    });
  });
});
