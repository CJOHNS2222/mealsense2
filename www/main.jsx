// Vite entry point for React
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './assets/styles/main.css';

// Temporarily disabled AuthWrapper for debugging
// import AuthWrapper from './components/AuthWrapper.jsx';

ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
