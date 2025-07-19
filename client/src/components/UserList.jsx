import React from 'react';
import { FiCircle, FiX } from 'react-icons/fi';

const UserList = ({ users, currentUser, onClose }) => {
  const onlineUsers = users.filter(user => user.isOnline);
  const offlineUsers = users.filter(user => !user.isOnline);

  return (
    <div className="h-full flex flex-col bg-primary text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <h2 className="text-lg font-semibold">Users</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/10 rounded sm:hidden"
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-y-auto">
        {/* Online Users */}
        {onlineUsers.length > 0 && (
          <div className="p-4">
            <h3 className="text-sm font-medium text-white/60 mb-3">
              Online ({onlineUsers.length})
            </h3>
            <div className="space-y-2">
              {onlineUsers.map((user) => (
                <div
                  key={user.id}
                  className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                    user.username === currentUser?.username
                      ? 'bg-white/20'
                      : 'hover:bg-white/10'
                  }`}
                >
                  <div className="relative">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm font-medium">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-primary rounded-full"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {user.username}
                      {user.username === currentUser?.username && (
                        <span className="ml-2 text-xs text-white/60">(You)</span>
                      )}
                    </div>
                    <div className="text-xs text-white/60">
                      Online
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Offline Users */}
        {offlineUsers.length > 0 && (
          <div className="p-4 border-t border-white/10">
            <h3 className="text-sm font-medium text-white/60 mb-3">
              Offline ({offlineUsers.length})
            </h3>
            <div className="space-y-2">
              {offlineUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <div className="relative">
                    <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-sm font-medium text-white/60">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-gray-400 border-2 border-primary rounded-full"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white/60 truncate">
                      {user.username}
                    </div>
                    <div className="text-xs text-white/40">
                      Last seen {new Date(user.lastSeen).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {users.length === 0 && (
          <div className="flex items-center justify-center h-full text-white/60">
            <div className="text-center">
              <div className="text-4xl mb-2">👥</div>
              <p>No users online</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList; 