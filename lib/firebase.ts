// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_APP_MEASUREMENT_ID,
};

// Initialize Firebase — guard against missing env vars during SSR/static build
let app: ReturnType<typeof initializeApp>;
if (getApps().length > 0) {
  app = getApps()[0];
} else if (firebaseConfig.apiKey && firebaseConfig.projectId) {
  app = initializeApp(firebaseConfig);
} else {
  // Fallback for SSR/build when env vars are not yet available
  app = initializeApp({ projectId: 'placeholder', apiKey: 'placeholder', appId: 'placeholder' });
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
