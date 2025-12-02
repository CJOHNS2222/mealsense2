// Vite entry point for React
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './assets/styles/main.css';

import AuthWrapper from './components/AuthWrapper.jsx';

ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <AuthWrapper>
      <App />
    </AuthWrapper>
  </React.StrictMode>
);
