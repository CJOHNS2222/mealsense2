import React, { useState } from 'react';
const FamilyGroupManager = React.lazy(() => import('./FamilyGroupManager.jsx'));

export default function SettingsMenu({ onClose, onRerunTutorial, onCheckUpdates }) {
  const [showFamily, setShowFamily] = useState(false);
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.45)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        background: '#fff',
        color: '#222',
        borderRadius: 16,
        boxShadow: '0 4px 24px #0006',
        padding: '2.5rem 2rem',
        maxWidth: 400,
        minWidth: 320,
        textAlign: 'center',
        position: 'relative',
      }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 10, right: 16, background: 'none', border: 'none', fontSize: 22, color: '#a9441b', cursor: 'pointer' }}>&times;</button>
        <h2 style={{ marginTop: 0 }}>Settings</h2>
        <button onClick={onRerunTutorial} style={btnStyle}>Re-run Tutorial</button>
        <button onClick={onCheckUpdates} style={btnStyle}>Check for Updates</button>
        <button onClick={() => setShowFamily(f => !f)} style={btnStyle}>Family Group Settings</button>
        {showFamily && (
          <div style={{ marginTop: 18 }}>
            <React.Suspense fallback={<div>Loading family group...</div>}>
              <FamilyGroupManager />
            </React.Suspense>
          </div>
        )}
      </div>
    </div>
  );
}

const btnStyle = {
  width: '100%',
  background: '#ffb347',
  color: '#222',
  border: 'none',
  borderRadius: 8,
  padding: '0.7rem 0',
  fontWeight: 'bold',
  fontSize: 17,
  margin: '0.5rem 0',
  cursor: 'pointer',
};
