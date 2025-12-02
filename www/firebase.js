// rewrite/firebase.js
// Firebase and Gemini setup for React
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import ai from '@react-native-firebase/ai';

const firebaseConfig = {
  apiKey: "AIzaSyB2T_ZT1tVW11I423cjlylrQOkBHYoTDVw",
  authDomain: "gen-lang-client-0381888356.firebaseapp.com",
  projectId: "gen-lang-client-0381888356",
  storageBucket: "gen-lang-client-0381888356.appspot.com",
  messagingSenderId: "1010101010101", // replace with your sender ID if needed
  appId: "1:1010101010101:web:abcdef1234567890", // replace with your app ID if needed
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Anonymous sign-in helper
export function signInAnon() {
  return signInAnonymously(auth);
}





// Example usage of @react-native-firebase/ai
// ai().invoke('gemini-pro', { contents: [...] })


