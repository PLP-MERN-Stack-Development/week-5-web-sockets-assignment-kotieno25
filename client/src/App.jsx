import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSocket } from './socket/socket';
import Login from './pages/Login';
import Chat from './pages/Chat';
import './App.css';

function App() {
  const { currentUser, isConnected } = useSocket();

  return (
    <div className="App">
      <Routes>
        <Route 
          path="/" 
          element={
            currentUser ? (
              <Navigate to="/chat" replace />
            ) : (
              <Login />
            )
          } 
        />
        <Route 
          path="/chat" 
          element={
            currentUser ? (
              <Chat />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App; 