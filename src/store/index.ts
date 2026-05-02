import { create } from "zustand";
import { UserProfile } from "@/types";

interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  setUser: (user: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  addXP: (amount: number) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  updateProfile: (updates) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    })),
  addXP: (amount) =>
    set((state) => {
      if (!state.user) return state;
      const newXP = state.user.xp + amount;
      const newLevel = Math.floor(newXP / 500) + 1;
      return {
        user: { ...state.user, xp: newXP, level: newLevel },
      };
    }),
}));

interface ThemeState {
  theme: "light" | "dark";
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: "light",
  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === "light" ? "dark" : "light",
    })),
  setTheme: (theme) => set({ theme }),
}));

interface NotificationState {
  unreadCount: number;
  setUnreadCount: (count: number) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  unreadCount: 3, // Set to 3 for demo
  setUnreadCount: (count) => set({ unreadCount: count }),
}));

interface LangState {
  lang: "en" | "hi";
  setLang: (lang: "en" | "hi") => void;
  toggleLang: () => void;
}

export const useLangStore = create<LangState>((set) => ({
  lang: "en",
  setLang: (lang) => set({ lang }),
  toggleLang: () => set((state) => ({ lang: state.lang === "en" ? "hi" : "en" })),
}));
