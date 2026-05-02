import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "mock-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "mock-project.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "mock-project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "mock-project.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "000000000000",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:000000000000:web:0000000000000000000000",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-0000000000",
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let isDemoMode = false;

try {
  if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
    throw new Error("Missing Firebase API Key");
  }
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.warn("Firebase initialization failed. Using mock services.", error);
  isDemoMode = true;
  // Fallback objects to prevent crashes
  app = {} as FirebaseApp;
  auth = { currentUser: null } as unknown as Auth;
  db = {} as unknown as Firestore;
}

const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider, isDemoMode };
