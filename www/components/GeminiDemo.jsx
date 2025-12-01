// Example usage of Gemini and Firebase in React
import React, { useState } from 'react';
import { callGemini, signInAnon } from '../firebase';

export default function GeminiDemo() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleGemini() {
    setLoading(true);
    setError('');
    setOutput('');
    try {
      await signInAnon(); // ensure signed in
      const result = await callGemini({ prompt: input });
      setOutput(result.data?.response || JSON.stringify(result.data));
    } catch (e) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 500, margin: '2rem auto', padding: 24, background: '#222', color: '#fff', borderRadius: 12 }}>
      <h2>Gemini API Demo</h2>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Ask Gemini..."
        style={{ width: '100%', padding: 8, fontSize: 16, marginBottom: 12, borderRadius: 6, border: '1px solid #888' }}
      />
      <button onClick={handleGemini} style={{ padding: '0.6rem 1.2rem', fontWeight: 'bold', borderRadius: 8, background: '#ffb347', color: '#222', border: 'none', fontSize: 16 }} disabled={loading}>
        {loading ? 'Thinking...' : 'Ask Gemini'}
      </button>
      {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
      {output && <pre style={{ marginTop: 16, background: '#111', padding: 12, borderRadius: 8 }}>{output}</pre>}
    </div>
  );
}
