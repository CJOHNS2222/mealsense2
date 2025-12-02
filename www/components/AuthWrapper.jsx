import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import AuthScreen from './AuthScreen';

export default function AuthWrapper({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', marginTop: 80 }}>Loading...</div>;
  if (!user) return <AuthScreen onAuth={() => setLoading(true)} />;

  return (
    <div>
      <div style={{ position: 'fixed', top: 10, right: 10, zIndex: 1000 }}>
        <span style={{ marginRight: 10 }}>Hi, {user.displayName || user.email}</span>
        <button onClick={() => signOut(auth)} style={{ background: '#eee', border: 'none', borderRadius: 6, padding: '0.4rem 0.8rem', cursor: 'pointer' }}>Sign Out</button>
      </div>
      {children}
    </div>
  );
}
