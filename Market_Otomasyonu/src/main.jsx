import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // App bileşeni import edilmeli

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App /> {/* App bileşenini render ediyoruz */}
  </React.StrictMode>
);
