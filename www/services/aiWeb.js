// Web-compatible AI helper using Google Generative AI (Gemini API)
// This replaces @react-native-firebase/ai for web builds

const GEMINI_API_KEY = 'AIzaSyB2T_ZT1tVW11I423cjlylrQOkBHYoTDVw'; // Your Firebase API key

export async function invokeGemini(model, contents) {
  // Use Google's Generative AI REST API for web
  const apiEndpoint = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
  
  const response = await fetch(apiEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents }),
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText}`);
  }

  return response.json();
}

// Mock the ai() function for web compatibility
export default function ai() {
  return {
    invoke: invokeGemini,
  };
}
