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
import { auth, db, googleProvider } from "@/lib/firebase";
import { useAuthStore } from "@/store";
import { UserProfile } from "@/types";
import toast from "react-hot-toast";

const DEFAULT_PROFILE: Omit<UserProfile, "uid" | "email" | "fullName" | "photoURL"> = {
  dob: "",
  mobile: "",
  address: "",
  constituency: "",
  voterId: "",
  isRegistered: false,
  interests: [],
  language: "en",
  accessibilityNeeds: "",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  xp: 0,
  level: 1,
  badges: [],
  quizScore: 0,
};

export function useAuth() {
  const { user, loading, setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
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
            };
            await setDoc(doc(db, "users", firebaseUser.uid), newProfile);
            setUser(newProfile);
          }
        } catch {
          // Firebase not configured - use local profile
          const localProfile: UserProfile = {
            ...DEFAULT_PROFILE,
            uid: firebaseUser.uid,
            email: firebaseUser.email || "",
            fullName: firebaseUser.displayName || "",
            photoURL: firebaseUser.photoURL || "",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          setUser(localProfile);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Welcome back! 🎉");
    } catch (error: unknown) {
      console.warn("Firebase Auth failed, using mock auth", error);
      const mockProfile: UserProfile = {
        ...DEFAULT_PROFILE,
        uid: "mock-user-123",
        email: email,
        fullName: "Demo User",
        photoURL: "",
      };
      setUser(mockProfile);
      toast.success("Welcome back (Mock Mode)! 🎉");
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });
      toast.success("Account created successfully! 🎊");
    } catch (error: unknown) {
      console.warn("Firebase Auth failed, using mock auth", error);
      const mockProfile: UserProfile = {
        ...DEFAULT_PROFILE,
        uid: "mock-user-123",
        email: email,
        fullName: name,
        photoURL: "",
      };
      setUser(mockProfile);
      toast.success("Account created successfully (Mock Mode)! 🎊");
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
      toast.success("Signed in with Google! 🎉");
    } catch (error: unknown) {
      console.warn("Firebase Auth failed, using mock auth", error);
      const mockProfile: UserProfile = {
        ...DEFAULT_PROFILE,
        uid: "mock-google-123",
        email: "demo@gmail.com",
        fullName: "Google Demo User",
        photoURL: "",
      };
      setUser(mockProfile);
      toast.success("Signed in with Google (Mock Mode)! 🎉");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      toast.success("Logged out successfully");
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Logout failed";
      toast.error(msg);
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
