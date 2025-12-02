import React, { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export default function AuthScreen({ onAuth }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState('signin');

  async function handleEmailAuth(e) {
    e.preventDefault();
    setError('');
    try {
      if (mode === 'signup') {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onAuth && onAuth();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleGoogle() {
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      onAuth && onAuth();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div style={{ maxWidth: 340, margin: '4rem auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #0002', padding: 32 }}>
      <h2 style={{ textAlign: 'center', marginBottom: 18 }}>{mode === 'signup' ? 'Sign Up' : 'Sign In'}</h2>
      <form onSubmit={handleEmailAuth}>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 6, border: '1px solid #bbb' }} />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required style={{ width: '100%', marginBottom: 18, padding: 8, borderRadius: 6, border: '1px solid #bbb' }} />
        <button type="submit" style={{ width: '100%', background: '#ffb347', color: '#222', border: 'none', borderRadius: 8, padding: '0.7rem 0', fontWeight: 'bold', fontSize: 17, marginBottom: 10 }}>
          {mode === 'signup' ? 'Create Account' : 'Sign In'}
        </button>
      </form>
      <button onClick={handleGoogle} style={{ width: '100%', background: '#4285F4', color: '#fff', border: 'none', borderRadius: 8, padding: '0.7rem 0', fontWeight: 'bold', fontSize: 17, marginBottom: 10 }}>
        Sign in with Google
      </button>
      <div style={{ textAlign: 'center', marginTop: 10 }}>
        {mode === 'signup' ? (
          <span>Already have an account? <button style={{ color: '#a9441b', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => setMode('signin')}>Sign In</button></span>
        ) : (
          <span>Need an account? <button style={{ color: '#a9441b', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => setMode('signup')}>Sign Up</button></span>
        )}
      </div>
      {error && <div style={{ color: 'red', marginTop: 12, textAlign: 'center' }}>{error}</div>}
    </div>
  );
}
