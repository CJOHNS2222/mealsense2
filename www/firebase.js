// rewrite/firebase.js
// Firebase and Gemini setup for React
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyBRm3LqGTz4THfXOkg9ZvKOZRBhz1WX22Y",
  authDomain: "gen-lang-client-0381888356.firebaseapp.com",
  projectId: "gen-lang-client-0381888356",
  storageBucket: "gen-lang-client-0381888356.appspot.com",
  messagingSenderId: "1010101010101", // replace with your sender ID if needed
  appId: "1:1010101010101:web:abcdef1234567890", // replace with your app ID if needed
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const functions = getFunctions(app, 'us-central1');

// Anonymous sign-in helper
export function signInAnon() {
  return signInAnonymously(auth);
}

// Gemini callable function
export const callGemini = httpsCallable(functions, 'callGemini');

// Example: await callGemini({ prompt: 'Hello Gemini' })
