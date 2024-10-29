import { createRoot } from 'react-dom/client'
import React from 'react';
import './index.css'
import App from './App.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import ToastProvider from "./component/ToastProvider";

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
   <AuthProvider>
    <ToastProvider>
      <App />
      </ToastProvider>
    </AuthProvider>
  </React.StrictMode>,
)
