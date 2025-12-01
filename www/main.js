console.log("App loaded");
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './assets/styles/main.css';

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<App />);
