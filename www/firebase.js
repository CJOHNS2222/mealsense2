// rewrite/firebase.js
// Firebase and Gemini setup for React
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
// React Native AI only works on mobile, not web
// import ai from '@react-native-firebase/ai';

const firebaseConfig = {
  apiKey: "AIzaSyCVlMsqNsW63L4m_u72Sv6WBFlw_pjUYpg",
  authDomain: "gen-lang-client-0381888356.firebaseapp.com",
  databaseURL: "https://gen-lang-client-0381888356-default-rtdb.firebaseio.com",
  projectId: "gen-lang-client-0381888356",
  storageBucket: "gen-lang-client-0381888356.firebasestorage.app",
  messagingSenderId: "89889306830",
  appId: "1:89889306830:web:be0e6e5b707e2ba89ef89f",
  measurementId: "G-LKST892KYM"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Anonymous sign-in helper
export function signInAnon() {
  return signInAnonymously(auth);
}

