import React, { useState, useEffect } from 'react';
import { db, auth, signInAnon } from '../../firebase';
import { collection, getDocs, setDoc, doc, onSnapshot } from 'firebase/firestore';
// Helper to get scheduled meals and pantry from localStorage/window (stub for now)
function getScheduledMeals() {
  // Example: [{ meal: 'Chicken Alfredo', ingredients: ['Chicken', 'Pasta', 'Cream'] }, ...]
  try {
    const raw = window.localStorage.getItem('scheduledMeals');
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function getPantryItems() {
  try {
    const raw = window.localStorage.getItem('pantryItems');
    if (raw) return JSON.parse(raw).map(i => i.name.toLowerCase());
  } catch {}
  return [];
}
  // Auto-generate shopping list from scheduled meals
  function handleAutoGenerate() {
    const scheduled = getScheduledMeals();
    const pantry = getPantryItems();
    if (!scheduled.length) {
      setFeedback('No scheduled meals found.');
      setTimeout(() => setFeedback(''), 1200);
      return;
    }
    // Collect all needed ingredients
    let needed = [];
    scheduled.forEach(m => {
      if (Array.isArray(m.ingredients)) needed.push(...m.ingredients);
    });
    // Remove those already in pantry
    needed = needed.filter(ing => !pantry.includes(ing.toLowerCase()));
    // Remove those already in shopping list
    const current = items.map(i => i.text.toLowerCase());
    needed = needed.filter(ing => !current.includes(ing.toLowerCase()));
    if (!needed.length) {
      setFeedback('No missing ingredients to add!');
      setTimeout(() => setFeedback(''), 1200);
      return;
    }
    setItems([...items, ...needed.map(text => ({ text, checked: false }))]);
    setFeedback(`Added ${needed.length} missing ingredient${needed.length > 1 ? 's' : ''}!`);
    setTimeout(() => setFeedback(''), 1200);
  }

export default function ShoppingTab() {
  const [items, setItems] = useState([]);
  // Sync shopping list with Firestore
  useEffect(() => {
    async function fetchShoppingList() {
      await signInAnon();
      const user = auth.currentUser;
      if (!user) return;
      const shopRef = collection(db, 'users', user.uid, 'shoppingList');
      onSnapshot(shopRef, snap => {
        setItems(snap.docs.map(d => ({ text: d.data().name, checked: false, ...d.data() })));
      });
    }
    fetchShoppingList();
  }, []);

  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [shareMsg, setShareMsg] = useState('');

  // Voice input state
  const [listening, setListening] = useState(false);
  const [voiceError, setVoiceError] = useState('');

  // Voice input handler
  function handleVoiceInput() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setVoiceError('Voice input not supported in this browser.');
      setTimeout(() => setVoiceError(''), 2000);
      return;
    }
    setVoiceError('');
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    setListening(true);
    recognition.onresult = event => {
      setListening(false);
      const transcript = event.results[0][0].transcript;
      if (transcript && transcript.trim()) {
        setInput(transcript.trim());
        setFeedback('Recognized: ' + transcript.trim());
        setTimeout(() => setFeedback(''), 1200);
      }
    };
    recognition.onerror = event => {
      setListening(false);
      setVoiceError('Voice error: ' + event.error);
      setTimeout(() => setVoiceError(''), 2000);
    };
    recognition.onend = () => setListening(false);
    recognition.start();
  }
  function handleShareClipboard() {
    if (items.length === 0) {
      setShareMsg('Nothing to share!');
      setTimeout(() => setShareMsg(''), 1200);
      return;
    }
    const text = items.map(i => (i.checked ? '✔ ' : '') + i.text).join('\n');
    navigator.clipboard.writeText(text).then(() => {
      setShareMsg('Copied to clipboard!');
      setTimeout(() => setShareMsg(''), 1200);
    });
  }

  function handleShareEmail() {
    if (items.length === 0) {
      setShareMsg('Nothing to share!');
      setTimeout(() => setShareMsg(''), 1200);
      return;
    }
    const subject = encodeURIComponent('My Shopping List');
    const body = encodeURIComponent(items.map(i => (i.checked ? '✔ ' : '') + i.text).join('\n'));
    window.open(`mailto:?subject=${subject}&body=${body}`);
  }

  function handleShareLink() {
    if (items.length === 0) {
      setShareMsg('Nothing to share!');
      setTimeout(() => setShareMsg(''), 1200);
      return;
    }
    // For demo: encode as URL param (not persistent)
    const base = window.location.origin || '';
    const param = encodeURIComponent(items.map(i => (i.checked ? '✔ ' : '') + i.text).join('\n'));
    const url = `${base}/?shoppingList=${param}`;
    navigator.clipboard.writeText(url).then(() => {
      setShareMsg('Shareable link copied!');
      setTimeout(() => setShareMsg(''), 1200);
    });
  }

  function handleAdd() {
    if (!input.trim()) return;
    setItems([...items, { text: input.trim(), checked: false }]);
    setInput('');
    setFeedback('Item added!');
    setTimeout(() => setFeedback(''), 1000);
  }

  function handleRemove(idx) {
    setItems(items => items.filter((_, i) => i !== idx));
    setFeedback('Item removed.');
    setTimeout(() => setFeedback(''), 1000);
  }

  function handleInputKey(e) {
    if (e.key === 'Enter') handleAdd();
  }

  function handleCheck(idx) {
    setItems(items => items.map((item, i) => i === idx ? { ...item, checked: !item.checked } : item));
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <div style={{ height: 32, marginBottom: '1rem' }} />
      <div style={{ fontWeight: 'bold', fontSize: 22, marginBottom: 10, textAlign: 'center' }}>
        Shopping List
      </div>


      {/* Share & Auto-generate buttons */}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 10, flexWrap: 'wrap' }}>
        <button style={btnStyle} onClick={handleShareClipboard}>Copy</button>
        <button style={btnStyle} onClick={handleShareEmail}>Email</button>
        <button style={btnStyle} onClick={handleShareLink}>Link</button>
        <button style={{ ...btnStyle, background: 'linear-gradient(90deg, #2563eb 0%, #4fd1c5 100%)' }} onClick={handleAutoGenerate}>Auto-Generate from Meal Plan</button>
      </div>
      {shareMsg && <div style={{ color: '#2563eb', textAlign: 'center', marginBottom: 8 }}>{shareMsg}</div>}

      {/* Add item input with voice */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 18, justifyContent: 'center', alignItems: 'center' }}>
        <input
          placeholder="Add item..."
          style={inputStyle}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleInputKey}
        />
        <button style={btnStyle} onClick={handleAdd}>+</button>
        <button
          style={{ ...btnStyle, background: listening ? '#4fd1c5' : '#232323', color: listening ? '#232323' : '#fff', fontSize: 18, padding: '0.6rem 1rem' }}
          onClick={handleVoiceInput}
          title="Voice input"
          aria-label="Voice input"
        >
          {listening ? '🎤...' : '🎤'}
        </button>
      </div>
      {voiceError && <div style={{ color: 'red', textAlign: 'center', marginBottom: 8 }}>{voiceError}</div>}
      {feedback && <div style={{ color: 'green', textAlign: 'center', marginBottom: 10 }}>{feedback}</div>}
      {/* Shopping list items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.length === 0 && <div style={{ color: '#bbb', textAlign: 'center' }}>No items in shopping list.</div>}
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#2a0d08', color: '#fff', borderRadius: 8, padding: '0.7rem 1rem', fontSize: 16 }}>
            <input type="checkbox" checked={item.checked} onChange={() => handleCheck(i)} style={{ marginRight: 10, width: 18, height: 18 }} />
            <span style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flex: 1,
              textDecoration: item.checked ? 'line-through' : 'none',
              color: item.checked ? '#bbb' : '#fff',
              fontStyle: item.checked ? 'italic' : 'normal',
            }}>{item.text}</span>
            <button style={removeBtnStyle} onClick={() => handleRemove(i)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}

const btnStyle = {
  background: 'linear-gradient(90deg, #a9441b 0%, #ffb347 100%)',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  padding: '0.6rem 1.2rem',
  fontWeight: 'bold',
  fontSize: 16,
  boxShadow: '0 2px 6px #0003',
  cursor: 'pointer',
};

const inputStyle = {
  borderRadius: 6,
  border: '1px solid #bbb',
  padding: '0.5rem 0.8rem',
  fontSize: 16,
  outline: 'none',
  minWidth: 180,
};

const removeBtnStyle = {
  ...btnStyle,
  background: '#e74c3c',
  width: 80,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 38,
  padding: 0,
  fontSize: 16,
};

