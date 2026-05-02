"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  User as FirebaseUser
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

export function useAuth() {
  const { user, loading, setUser, setLoading } = useAuthStore();

  useEffect(() => {
    // Safety timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (loading) {
        setLoading(false);
      }
    }, 2000);

    if (isDemoMode) {
      setLoading(false);
      return () => clearTimeout(timeout);
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      clearTimeout(timeout);
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
            } as UserProfile;
            await setDoc(doc(db, "users", firebaseUser.uid), newProfile);
            setUser(newProfile);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setUser({
            ...DEFAULT_PROFILE,
            uid: firebaseUser.uid,
            email: firebaseUser.email || "",
            fullName: firebaseUser.displayName || "",
            photoURL: firebaseUser.photoURL || "",
          } as UserProfile);
        }
      } else {
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
      toast.success("Welcome back (Demo Mode)! 🎉");
      return;
    }
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Welcome back! 🎉");
    } catch (error: any) {
      toast.error(error.message);
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
    } catch (error: any) {
      toast.error(error.message);
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
      toast.success("Signed in with Google (Demo Mode)! 🎉");
      return;
    }
    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
      toast.success("Signed in with Google! 🎉");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (!isDemoMode) {
        await signOut(auth);
      }
      setUser(null);
      toast.success("Logged out successfully");
    } catch (error: any) {
      toast.error(error.message);
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
