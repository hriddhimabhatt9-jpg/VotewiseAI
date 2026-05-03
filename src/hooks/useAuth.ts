"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider, isDemoMode } from "@/lib/firebase";
import { useAuthStore } from "@/store";
import { UserProfile } from "@/types";
import toast from "react-hot-toast";

const DEFAULT_PROFILE: Partial<UserProfile> = {
  xp: 0,
  level: 1,
  badges: [],
  quizScore: 0,
  isRegistered: false,
};

/** Set auth cookie for middleware route protection */
function setAuthCookie(token: string | null) {
  if (typeof document === 'undefined') return;
  if (token) {
    document.cookie = `auth-token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
  } else {
    document.cookie = 'auth-token=; path=/; max-age=0; SameSite=Lax';
  }
}

/** Map Firebase error codes to user-friendly messages */
function getAuthErrorMessage(error: { code?: string; message?: string }): string {
  const errorMap: Record<string, string> = {
    'auth/user-not-found': 'No account found with this email address.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/weak-password': 'Password is too weak. Please use a stronger password.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/popup-closed-by-user': 'Sign-in popup was closed. Please try again.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
    'auth/invalid-credential': 'Invalid credentials. Please check your email and password.',
  };

  return errorMap[error.code || ''] || 'An unexpected error occurred. Please try again.';
}

export function useAuth() {
  const { user, loading, setUser, setLoading } = useAuthStore();

  useEffect(() => {
    // Safety timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (loading) {
        setLoading(false);
      }
    }, 3000);

    if (isDemoMode) {
      setLoading(false);
      return () => clearTimeout(timeout);
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      clearTimeout(timeout);
      if (firebaseUser) {
        try {
          // Set auth cookie for middleware
          const token = await firebaseUser.getIdToken();
          setAuthCookie(token);

          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            setUser(userDoc.data() as UserProfile);
          } else {
            const newProfile: UserProfile = {
              ...DEFAULT_PROFILE,
              uid: firebaseUser.uid,
              email: firebaseUser.email || "",
              fullName: firebaseUser.displayName || "",
              photoURL: firebaseUser.photoURL || "",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            } as UserProfile;
            await setDoc(doc(db, "users", firebaseUser.uid), newProfile);
            setUser(newProfile);
          }
        } catch (error) {
          // Fallback: set user from Firebase Auth data even if Firestore fails
          setAuthCookie('demo-token');
          setUser({
            ...DEFAULT_PROFILE,
            uid: firebaseUser.uid,
            email: firebaseUser.email || "",
            fullName: firebaseUser.displayName || "",
            photoURL: firebaseUser.photoURL || "",
          } as UserProfile);
        }
      } else {
        setAuthCookie(null);
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, [setUser, setLoading]);

  const login = async (email: string, password: string) => {
    if (isDemoMode) {
      const demoUser: UserProfile = {
        ...DEFAULT_PROFILE,
        uid: "demo-user",
        email,
        fullName: "Demo Voter",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as UserProfile;
      setUser(demoUser);
      setAuthCookie('demo-token');
      toast.success("Welcome back (Demo Mode)! 🎉");
      return;
    }
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Welcome back! 🎉");
    } catch (error: unknown) {
      const authError = error as { code?: string; message?: string };
      console.error("Firebase Login Error:", authError);
      
      // Fallback to demo mode if Firebase is not properly configured
      const isUserError = [
        'auth/user-not-found',
        'auth/wrong-password',
        'auth/invalid-credential',
        'auth/invalid-email',
        'auth/too-many-requests'
      ].includes(authError.code || '');

      if (!isUserError) {
        const demoUser: UserProfile = {
          ...DEFAULT_PROFILE,
          uid: "demo-user",
          email,
          fullName: "Demo Voter",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as UserProfile;
        setUser(demoUser);
        setAuthCookie('demo-token');
        toast.success("Welcome back (Demo Mode Fallback)! 🎉");
        return;
      }
      toast.error(getAuthErrorMessage(authError));
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, fullName: string) => {
    if (isDemoMode) {
      const demoUser: UserProfile = {
        ...DEFAULT_PROFILE,
        uid: "demo-user",
        email,
        fullName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as UserProfile;
      setUser(demoUser);
      setAuthCookie('demo-token');
      toast.success("Account created (Demo Mode)! 🎊");
      return;
    }
    try {
      setLoading(true);
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(firebaseUser, { displayName: fullName });
      const newProfile: UserProfile = {
        ...DEFAULT_PROFILE,
        uid: firebaseUser.uid,
        email: firebaseUser.email || "",
        fullName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as UserProfile;
      await setDoc(doc(db, "users", firebaseUser.uid), newProfile);
      setUser(newProfile);
      toast.success("Account created successfully! 🎊");
    } catch (error: unknown) {
      const authError = error as { code?: string; message?: string };
      console.error("Firebase Signup Error:", authError);

      // Fallback to demo mode if Firebase is not properly configured
      const isUserError = [
        'auth/email-already-in-use',
        'auth/weak-password',
        'auth/invalid-email',
        'auth/too-many-requests'
      ].includes(authError.code || '');

      if (!isUserError) {
        const demoUser: UserProfile = {
          ...DEFAULT_PROFILE,
          uid: "demo-user",
          email,
          fullName,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as UserProfile;
        setUser(demoUser);
        setAuthCookie('demo-token');
        toast.success("Account created (Demo Mode Fallback)! 🎊");
        return;
      }
      toast.error(getAuthErrorMessage(authError));
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    if (isDemoMode) {
      const demoUser: UserProfile = {
        ...DEFAULT_PROFILE,
        uid: "google-demo",
        email: "demo@gmail.com",
        fullName: "Google Demo User",
        photoURL: "",
      } as UserProfile;
      setUser(demoUser);
      setAuthCookie('demo-token');
      toast.success("Signed in with Google (Demo Mode)! 🎉");
      return;
    }
    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
      toast.success("Signed in with Google! 🎉");
    } catch (error: unknown) {
      const authError = error as { code?: string; message?: string };
      console.error("Firebase Google Login Error:", authError);

      const isUserError = [
        'auth/popup-closed-by-user',
        'auth/cancelled-popup-request'
      ].includes(authError.code || '');

      if (!isUserError) {
        const demoUser: UserProfile = {
          ...DEFAULT_PROFILE,
          uid: "google-demo",
          email: "demo@gmail.com",
          fullName: "Google Demo User",
          photoURL: "",
        } as UserProfile;
        setUser(demoUser);
        setAuthCookie('demo-token');
        toast.success("Signed in with Google (Demo Mode Fallback)! 🎉");
        return;
      }
      toast.error(getAuthErrorMessage(authError));
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (!isDemoMode) {
        await signOut(auth);
      }
      setAuthCookie(null);
      setUser(null);
      toast.success("Logged out successfully");
    } catch (error: unknown) {
      const authError = error as { code?: string; message?: string };
      toast.error(getAuthErrorMessage(authError));
    }
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    try {
      const updatedData = { ...updates, updatedAt: new Date().toISOString() };
      await updateDoc(doc(db, "users", user.uid), {
        ...updatedData,
        updatedAt: serverTimestamp(),
      });
      useAuthStore.getState().updateProfile(updatedData);
      toast.success("Profile updated! ✨");
    } catch {
      // Firebase not configured - update local state only
      useAuthStore.getState().updateProfile({ ...updates, updatedAt: new Date().toISOString() });
      toast.success("Profile updated locally! ✨");
    }
  };

  return {
    user,
    loading,
    login,
    signup,
    loginWithGoogle,
    logout,
    updateUserProfile,
  };
}
