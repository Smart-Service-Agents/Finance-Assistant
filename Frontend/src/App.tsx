import React from 'react';
import Layout from './components/Layout/Layout';
import { ChatProvider } from './context/ChatContext';
import { AuthProvider } from './context/AuthContext';
import ThemeToggle from './components/UI/ThemeToggle';

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <ThemeToggle />
        <Layout />
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;