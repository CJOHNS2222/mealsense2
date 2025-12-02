// Example usage of Gemini and Firebase in React
import React, { useState } from 'react';
import ai from '@react-native-firebase/ai';
import { signInAnon } from '../firebase';

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
      // Text prompt example
      const result = await ai().invoke('gemini-pro', {
        contents: [
          {
            role: 'user',
            parts: [
              { text: input }
            ]
          }
        ]
      });
      setOutput(result?.candidates?.[0]?.content?.parts?.[0]?.text || JSON.stringify(result));
    } catch (e) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  // Example: Image analysis (base64 string)
  // async function handleImageAnalysis(base64Image) {
  //   setLoading(true);
  //   setError('');
  //   setOutput('');
  //   try {
  //     await signInAnon();
  //     const result = await ai().invoke('gemini-pro-vision', {
  //       contents: [
  //         {
  //           role: 'user',
  //           parts: [
  //             { text: 'Analyze this image.' },
  //             { inlineData: { mimeType: 'image/jpeg', data: base64Image } }
  //           ]
  //         }
  //       ]
  //     });
  //     setOutput(result?.candidates?.[0]?.content?.parts?.[0]?.text || JSON.stringify(result));
  //   } catch (e) {
  //     setError(e.message || String(e));
  //   } finally {
  //     setLoading(false);
  //   }
  // }

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
