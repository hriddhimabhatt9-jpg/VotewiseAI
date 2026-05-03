import { GoogleAuthProvider } from "firebase/auth";
import { app, auth, db } from "../../my_api";

const isDemoMode = !process.env.NEXT_PUBLIC_FIREBASE_API_KEY && !process.env.FIREBASE_API_KEY;

const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider, isDemoMode };
