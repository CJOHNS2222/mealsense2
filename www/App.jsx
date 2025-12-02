// Placeholder for App.jsx. Will copy contents from App.js next.
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
  const [showTutorial, setShowTutorial] = useState(() => !window.localStorage.getItem('tutorialComplete'));
  const [tutorialStep, setTutorialStep] = useState(0);
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

  // Tutorial steps
  const tutorialSteps = [
    {
      tab: 0,
      title: 'Welcome to Smart Pantry Chef!',
      text: 'This quick tutorial will show you how to use AI to manage your pantry, generate recipes, and plan meals. Click OK to begin.',
    },
    {
      tab: 0,
      title: 'Pantry: Analyze Button',
      text: 'Use the Analyze button to take a picture of your pantry. AI will identify and document all your food items automatically.',
    },
    {
      tab: 0,
      title: 'Pantry: Inventory List',
      text: 'Here is your inventory. For this demo, we have added some sample items so you know what to expect.',
    },
    {
      tab: 1,
      title: 'Recipes Tab',
      text: 'The Recipes tab uses AI to generate high-quality, creative recipes based on your pantry. Save your favorites!',
    },
    {
      tab: 2,
      title: 'Schedule Tab',
      text: 'Drag and drop recipes to plan your meals for the week. Use the "Add Missing Ingredients" button to ensure you have everything you need.',
    },
    {
      tab: 3,
      title: 'Shopping Tab',
      text: 'The Shopping tab keeps your grocery list up to date with all missing ingredients for your scheduled meals.',
    },
    {
      tab: 0,
      title: 'All Set!',
      text: 'You are ready to get started. You can revisit this tutorial anytime from the app settings. Enjoy using Smart Pantry Chef!',
    },
  ];

  function handleNextTutorial() {
    if (tutorialStep < tutorialSteps.length - 1) {
      setTab(tutorialSteps[tutorialStep + 1].tab);
      setTutorialStep(tutorialStep + 1);
    } else {
      setShowTutorial(false);
      window.localStorage.setItem('tutorialComplete', '1');
    }
  }

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
        <div style={{ margin: '2rem 0' }}>
          <React.Suspense fallback={<div>Loading family group...</div>}>
            {/** Family group sharing UI */}
            {typeof window !== 'undefined' && require('./components/FamilyGroupManager.jsx').default ? React.createElement(require('./components/FamilyGroupManager.jsx').default) : null}
          </React.Suspense>
        </div>
        {showTutorial && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.45)',
            zIndex: 9999,
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
              textAlign: 'center',
              position: 'relative',
            }}>
              <h2 style={{ marginTop: 0 }}>{tutorialSteps[tutorialStep].title}</h2>
              <div style={{ fontSize: 17, margin: '1.2rem 0' }}>{tutorialSteps[tutorialStep].text}</div>
              <button
                onClick={handleNextTutorial}
                style={{
                  background: '#ffb347',
                  color: '#222',
                  border: 'none',
                  borderRadius: 8,
                  padding: '0.7rem 2.2rem',
                  fontWeight: 'bold',
                  fontSize: 17,
                  marginTop: 18,
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px #0003',
                }}
              >
                {tutorialStep === tutorialSteps.length - 1 ? 'Finish' : 'OK'}
              </button>
            </div>
          </div>
        )}
      </main>
      <nav style={navStyles}>
        {TABS.map((t, i) => (
          <button
            key={t.name}
            onClick={() => setTab(i)}
            style={tabBtn(i)}
            disabled={showTutorial}
          >
            {t.name}
          </button>
        ))}
      </nav>
    </div>
  );
}
