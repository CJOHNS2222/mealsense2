import React, { useState, useEffect } from 'react';
import PantryTab from './components/PantryTab/PantryTab';
import RecipeTab from './components/RecipeTab/RecipeTab';
import ScheduleTab from './components/ScheduleTab/ScheduleTab';
import ShoppingTab from './components/ShoppingTab/ShoppingTab';

const TABS = [
  { name: 'Pantry', component: <PantryTab /> },
  { name: 'Recipes', component: <RecipeTab /> },
  { name: 'Schedule', component: <ScheduleTab /> },
  { name: 'Shopping', component: <ShoppingTab /> },
];

export default function App() {
  const [tab, setTab] = useState(0);
  const [dark, setDark] = useState(() => {
    const saved = window.localStorage.getItem('themeMode');
    if (saved) return saved === 'dark';
    // Prefer system dark mode
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    window.localStorage.setItem('themeMode', dark ? 'dark' : 'light');
    document.body.style.background = dark ? '#181818' : '#fff';
    document.body.style.color = dark ? '#eee' : '#222';
  }, [dark]);

  const darkStyles = {
    background: dark ? '#181818' : '#3a1814',
    color: dark ? '#eee' : '#fff',
    minHeight: '100vh',
    transition: 'background 0.2s, color 0.2s',
  };
  const headerStyles = {
    background: dark ? '#232323' : '#4a1a13',
    color: dark ? '#fff' : '#fff',
    padding: '1rem',
    textAlign: 'center',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 100,
    boxShadow: '0 2px 8px #0004',
  };
  const navStyles = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    background: dark ? '#232323' : '#2a0d08',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.7rem 0 0.7rem 0',
    zIndex: 101,
    boxShadow: '0 -2px 8px #0004',
  };
  const tabBtn = i => ({
    background: tab === i ? (dark ? '#444' : '#ffb347') : (dark ? '#232323' : '#fff'),
    color: tab === i ? (dark ? '#ffb347' : '#3a1814') : (dark ? '#ffb347' : '#3a1814'),
    border: 'none',
    borderRadius: '8px',
    padding: '0.6rem 1.2rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: 16,
    minWidth: 80,
    boxShadow: tab === i ? '0 2px 6px #0003' : 'none',
    transition: 'background 0.2s',
  });

  return (
    <div style={darkStyles}>
      <header style={headerStyles}>
        <h1 style={{ margin: 0 }}>Smart Pantry Chef</h1>
        <button
          onClick={() => setDark(d => !d)}
          style={{
            position: 'absolute',
            right: 18,
            top: 18,
            background: dark ? '#ffb347' : '#232323',
            color: dark ? '#232323' : '#ffb347',
            border: 'none',
            borderRadius: 8,
            padding: '0.4rem 1rem',
            fontWeight: 'bold',
            fontSize: 15,
            cursor: 'pointer',
            boxShadow: '0 2px 6px #0003',
            transition: 'background 0.2s, color 0.2s',
          }}
          aria-label="Toggle dark mode"
        >
          {dark ? '☀ Light' : '🌙 Dark'}
        </button>
      </header>
      <main style={{ padding: '5.5rem 0 4.5rem 0', minHeight: 'calc(100vh - 10rem)' }}>
        {TABS[tab].component}
      </main>
      <nav style={navStyles}>
        {TABS.map((t, i) => (
          <button
            key={t.name}
            onClick={() => setTab(i)}
            style={tabBtn(i)}
          >
            {t.name}
          </button>
        ))}
      </nav>
    </div>
  );
}
