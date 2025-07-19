import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../socket/socket';
import { FiSend, FiSmile, FiPaperclip, FiUsers, FiHash, FiPlus, FiLogOut, FiWifi, FiWifiOff } from 'react-icons/fi';
import MessageList from '../components/MessageList';
import UserList from '../components/UserList';
import RoomList from '../components/RoomList';
import MessageInput from '../components/MessageInput';
import CreateRoomModal from '../components/CreateRoomModal';
import toast from 'react-hot-toast';

const Chat = () => {
  const {
    currentUser,
    messages,
    users,
    rooms,
    currentRoom,
    typingUsers,
    unreadCounts,
    isConnected,
    sendMessage,
    setTyping,
    joinRoom,
    createRoom,
    disconnect
  } = useSocket();

  const [showUserList, setShowUserList] = useState(false);
  const [showRoomList, setShowRoomList] = useState(false);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  // Handle typing indicator
  useEffect(() => {
    if (isTyping) {
      setTyping(true, currentRoom);
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        setTyping(false, currentRoom);
      }, 1000);
    } else {
      setTyping(false, currentRoom);
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [isTyping, currentRoom, setTyping]);

  // Handle disconnect
  const handleDisconnect = () => {
    disconnect();
    toast.success('Disconnected from chat');
  };

  // Get current room info
  const currentRoomInfo = rooms.find(room => room.id === currentRoom) || {
    id: 'general',
    name: 'General',
    userCount: users.length
  };

  return (
    <div className="h-screen flex flex-col bg-secondary">
      {/* Header */}
      <header className="bg-primary shadow-sm border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <FiHash className="w-5 h-5 text-white" />
              <h1 className="text-lg font-semibold text-white">
                {currentRoomInfo.name}
              </h1>
            </div>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <span>{currentRoomInfo.userCount} members</span>
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Connection Status */}
            <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
              isConnected 
                ? 'bg-green-500 text-white' 
                : 'bg-red-500 text-white'
            }`}>
              {isConnected ? <FiWifi className="w-3 h-3" /> : <FiWifiOff className="w-3 h-3" />}
              {isConnected ? 'Online' : 'Offline'}
            </div>

            {/* Mobile Menu Buttons */}
            <div className="flex items-center gap-1 sm:hidden">
              <button
                onClick={() => setShowRoomList(!showRoomList)}
                className="p-2 text-white hover:bg-white/10 rounded"
              >
                <FiHash className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowUserList(!showUserList)}
                className="p-2 text-white hover:bg-white/10 rounded"
              >
                <FiUsers className="w-4 h-4" />
              </button>
            </div>

            {/* Desktop Menu Buttons */}
            <div className="hidden sm:flex items-center gap-1">
              <button
                onClick={() => setShowCreateRoom(true)}
                className="p-2 text-white hover:bg-white/10 rounded"
                title="Create Room"
              >
                <FiPlus className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowRoomList(!showRoomList)}
                className="p-2 text-white hover:bg-white/10 rounded"
                title="Rooms"
              >
                <FiHash className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowUserList(!showUserList)}
                className="p-2 text-white hover:bg-white/10 rounded"
                title="Users"
              >
                <FiUsers className="w-4 h-4" />
              </button>
            </div>

            {/* User Info & Logout */}
            <div className="flex items-center gap-2 ml-2">
              <div className="hidden sm:block text-right">
                <div className="text-white text-sm font-medium">
                  {currentUser?.username}
                </div>
                <div className="text-white/60 text-xs">
                  Online
                </div>
              </div>
              <button
                onClick={handleDisconnect}
                className="p-2 text-white hover:bg-white/10 rounded"
                title="Logout"
              >
                <FiLogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Rooms */}
        <div className={`w-64 bg-primary border-r border-white/10 flex flex-col ${
          showRoomList ? 'block' : 'hidden sm:flex'
        }`}>
          <RoomList
            rooms={rooms}
            currentRoom={currentRoom}
            unreadCounts={unreadCounts}
            onRoomSelect={joinRoom}
            onClose={() => setShowRoomList(false)}
          />
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-hidden">
            <MessageList
              messages={messages}
              currentUser={currentUser}
              typingUsers={typingUsers}
            />
          </div>

          {/* Message Input */}
          <div className="border-t bg-primary">
            <MessageInput
              onSendMessage={sendMessage}
              onTypingChange={setIsTyping}
              disabled={!isConnected}
            />
          </div>
        </div>

        {/* Sidebar - Users */}
        <div className={`w-64 bg-primary border-l border-white/10 flex flex-col ${
          showUserList ? 'block' : 'hidden sm:flex'
        }`}>
          <UserList
            users={users}
            currentUser={currentUser}
            onClose={() => setShowUserList(false)}
          />
        </div>
      </div>

      {/* Create Room Modal */}
      <CreateRoomModal
        isOpen={showCreateRoom}
        onClose={() => setShowCreateRoom(false)}
        onCreateRoom={createRoom}
      />

      {/* Mobile Overlay */}
      {(showUserList || showRoomList) && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 sm:hidden"
          onClick={() => {
            setShowUserList(false);
            setShowRoomList(false);
          }}
        />
      )}
    </div>
  );
};

export default Chat; 