/**
 * Centralized API Configuration
 * All API keys are loaded from environment variables — NEVER hardcode keys here.
 * 
 * For local development: create .env.local with your keys
 * For production (Cloud Run): set env vars via gcloud CLI
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// ─── Google Maps API ───
export const GOOGLE_MAPS_API_KEY =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
  process.env.GOOGLE_MAPS_API_KEY ||
  '';

// ─── Gemini API (AI chatbot) ───
export const GEMINI_API_KEY =
  process.env.GEMINI_API ||
  process.env.GEMINI_API_KEY ||
  '';

export const genAI = GEMINI_API_KEY
  ? new GoogleGenerativeAI(GEMINI_API_KEY)
  : (null as unknown as GoogleGenerativeAI);

// ─── Firebase ───
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
};

let appInstance: FirebaseApp;
let authInstance: Auth;
let dbInstance: Firestore;

// Only initialize Firebase if we have an API key
if (typeof window !== 'undefined' || firebaseConfig.apiKey) {
  try {
    appInstance = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    authInstance = getAuth(appInstance);
    dbInstance = getFirestore(appInstance);
  } catch (e) {
    console.warn('Firebase initialization skipped:', e);
  }
}

export const app: FirebaseApp = appInstance!;
export const auth: Auth = authInstance!;
export const db: Firestore = dbInstance!;

// ─── Other Google APIs ───
export const SPEECH_TO_TEXT_API = process.env.SPEECH_TO_TEXT_API || '';
export const VISION_AI_API = process.env.VISION_AI_API || '';
export const GOOGLE_CALENDAR_API = process.env.GOOGLE_CALENDER_API || '';
