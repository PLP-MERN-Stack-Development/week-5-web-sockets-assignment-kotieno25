import React, { useState } from 'react';
import { useSocket } from '../socket/socket';
import { FiUser, FiWifi, FiWifiOff } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Login = () => {
  const [username, setUsername] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const { connect, isConnected } = useSocket();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username.trim()) {
      toast.error('Please enter a username');
      return;
    }

    if (username.trim().length < 3) {
      toast.error('Username must be at least 3 characters long');
      return;
    }

    setIsConnecting(true);
    
    try {
      connect(username.trim());
      // The socket hook will handle the connection and show success/error messages
    } catch (error) {
      toast.error('Failed to connect to server');
      setIsConnecting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
            <FiWifi className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-primary mb-2">
            Real-Time Chat
          </h1>
          <p className="text-secondary">
            Connect with others in real-time using Socket.io
          </p>
        </div>

        {/* Connection Status */}
        <div className="mb-6">
          <div className={`flex items-center justify-center gap-2 p-3 rounded-lg ${
            isConnected 
              ? 'bg-success-color text-white' 
              : 'bg-error-color text-white'
          }`}>
            {isConnected ? (
              <>
                <FiWifi className="w-4 h-4" />
                <span className="text-sm font-medium">Connected to server</span>
              </>
            ) : (
              <>
                <FiWifiOff className="w-4 h-4" />
                <span className="text-sm font-medium">Disconnected from server</span>
              </>
            )}
          </div>
        </div>

        {/* Login Form */}
        <div className="card p-6 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-primary mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-muted" />
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input pl-10"
                  placeholder="Enter your username"
                  disabled={isConnecting}
                  autoComplete="off"
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isConnecting || !username.trim()}
              className="btn btn-primary w-full"
            >
              {isConnecting ? (
                <>
                  <div className="loading-spinner"></div>
                  Connecting...
                </>
              ) : (
                'Join Chat'
              )}
            </button>
          </form>
        </div>

        {/* Features List */}
        <div className="mt-8 text-center">
          <h3 className="text-lg font-semibold text-primary mb-4">
            Features
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-secondary">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-success-color rounded-full"></div>
              Real-time messaging
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-success-color rounded-full"></div>
              Multiple chat rooms
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-success-color rounded-full"></div>
              Typing indicators
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-success-color rounded-full"></div>
              File sharing
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-success-color rounded-full"></div>
              Message reactions
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-success-color rounded-full"></div>
              Read receipts
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-muted">
          <p>Built with React, Socket.io, and Express</p>
          <p className="mt-1">Week 5 Assignment - Real-Time Communication</p>
        </div>
      </div>
    </div>
  );
};

export default Login; 