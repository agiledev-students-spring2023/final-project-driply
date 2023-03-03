import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import './styles/chats.css';
import './styles/profilepage.css';
import './styles/bookmarks.css';
import AuthProvider from './AuthContext';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <AuthProvider>
    <App />
  </AuthProvider>
  // </React.StrictMode>
);
