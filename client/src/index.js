import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import AuthState from './context/AuthContext';
import ChatMethods from './context/ChatContext';
import MessageMethods from './context/MessageContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <AuthState>
  <ChatMethods>
  <MessageMethods>
    <App />
  </MessageMethods>
  </ChatMethods>
  </AuthState>
  // </React.StrictMode>
);

