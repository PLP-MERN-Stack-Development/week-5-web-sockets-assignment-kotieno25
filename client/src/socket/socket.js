// socket.js - Socket.io client setup

import { io } from 'socket.io-client';
import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';

// Socket.io connection URL
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5005';

// Create socket instance
export const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 20000,
});

// Custom hook for using socket.io
export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState('general');
  const [typingUsers, setTypingUsers] = useState([]);
  const [privateMessages, setPrivateMessages] = useState(new Map());
  const [unreadCounts, setUnreadCounts] = useState(new Map());

  // Connect to socket server
  const connect = useCallback((username) => {
    socket.connect();
    if (username) {
      socket.emit('user_join', username);
    }
  }, []);

  // Disconnect from socket server
  const disconnect = useCallback(() => {
    socket.disconnect();
    setCurrentUser(null);
    setMessages([]);
    setUsers([]);
    setRooms([]);
    setTypingUsers([]);
    setPrivateMessages(new Map());
    setUnreadCounts(new Map());
  }, []);

  // Send a message
  const sendMessage = useCallback((content, roomId = currentRoom, fileData = null) => {
    if (!content.trim() && !fileData) return;
    
    socket.emit('send_message', { 
      content: content.trim(),
      roomId: roomId,
      ...fileData
    });
  }, [currentRoom]);

  // Send a private message
  const sendPrivateMessage = useCallback((to, content) => {
    if (!content.trim()) return;
    
    socket.emit('private_message', { 
      to, 
      content: content.trim() 
    });
  }, []);

  // Set typing status
  const setTyping = useCallback((isTyping, roomId = currentRoom) => {
    socket.emit('typing', { 
      isTyping, 
      roomId 
    });
  }, [currentRoom]);

  // Join room
  const joinRoom = useCallback((roomId) => {
    socket.emit('join_room', roomId);
    setCurrentRoom(roomId);
    setMessages([]);
  }, []);

  // Create room
  const createRoom = useCallback((roomName) => {
    socket.emit('create_room', { name: roomName });
  }, []);

  // Add message reaction
  const addReaction = useCallback((messageId, reaction, roomId = currentRoom) => {
    socket.emit('message_reaction', { 
      messageId, 
      reaction, 
      roomId 
    });
  }, [currentRoom]);

  // Mark message as read
  const markAsRead = useCallback((messageId, roomId = currentRoom) => {
    socket.emit('mark_read', { 
      messageId, 
      roomId 
    });
  }, [currentRoom]);

  // Socket event listeners
  useEffect(() => {
    // Connection events
    const onConnect = () => {
      setIsConnected(true);
      toast.success('Connected to server');
    };

    const onDisconnect = () => {
      setIsConnected(false);
      toast.error('Disconnected from server');
    };

    const onConnectError = (error) => {
      console.error('Connection error:', error);
      toast.error('Failed to connect to server');
    };

    // Authentication events
    const onUserJoined = (user) => {
      setCurrentUser(user);
      toast.success(`Welcome, ${user.username}!`);
    };

    const onAuthError = (error) => {
      toast.error(error);
    };

    // Message events
    const onReceiveMessage = (message) => {
      setMessages((prev) => [...prev, message]);
      
      // Update unread count if not in current room
      if (message.roomId !== currentRoom && message.sender !== currentUser?.username) {
        setUnreadCounts((prev) => {
          const newCounts = new Map(prev);
          const currentCount = newCounts.get(message.roomId) || 0;
          newCounts.set(message.roomId, currentCount + 1);
          return newCounts;
        });
      }
    };

    const onPrivateMessage = (message) => {
      const conversationId = [message.sender, message.recipient].sort().join('-');
      setPrivateMessages((prev) => {
        const newMap = new Map(prev);
        const existingMessages = newMap.get(conversationId) || [];
        newMap.set(conversationId, [...existingMessages, message]);
        return newMap;
      });
    };

    const onMessageDelivered = (data) => {
      // Handle message delivery acknowledgment
      console.log('Message delivered:', data.messageId);
    };

    const onMessageUpdated = (message) => {
      setMessages((prev) => 
        prev.map(msg => msg.id === message.id ? message : msg)
      );
    };

    // User events
    const onUserList = (userList) => {
      setUsers(userList);
    };

    const onUserJoinedChat = (user) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          system: true,
          content: `${user.username} joined the chat`,
          timestamp: new Date().toISOString(),
        },
      ]);
    };

    const onUserLeft = (user) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          system: true,
          content: `${user.username} left the chat`,
          timestamp: new Date().toISOString(),
        },
      ]);
    };

    const onUserJoinedRoom = (data) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          system: true,
          content: `${data.username} joined the room`,
          timestamp: new Date().toISOString(),
        },
      ]);
    };

    // Room events
    const onRoomsList = (roomsList) => {
      setRooms(roomsList);
    };

    const onRoomCreated = (room) => {
      setRooms((prev) => [...prev, room]);
      toast.success(`Room "${room.name}" created!`);
    };

    const onRoomMessages = (roomMessages) => {
      setMessages(roomMessages);
    };

    // Typing events
    const onTypingIndicator = (typingData) => {
      if (typingData.roomId === currentRoom) {
        if (typingData.isTyping) {
          setTypingUsers((prev) => [...prev.filter(u => u.username !== typingData.username), typingData]);
        } else {
          setTypingUsers((prev) => prev.filter(u => u.username !== typingData.username));
        }
      }
    };

    // Error events
    const onError = (error) => {
      toast.error(error);
    };

    // Register event listeners
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);
    socket.on('user_joined', onUserJoined);
    socket.on('auth_error', onAuthError);
    socket.on('receive_message', onReceiveMessage);
    socket.on('private_message', onPrivateMessage);
    socket.on('message_delivered', onMessageDelivered);
    socket.on('message_updated', onMessageUpdated);
    socket.on('user_list', onUserList);
    socket.on('user_joined', onUserJoinedChat);
    socket.on('user_left', onUserLeft);
    socket.on('user_joined_room', onUserJoinedRoom);
    socket.on('rooms_list', onRoomsList);
    socket.on('room_created', onRoomCreated);
    socket.on('room_messages', onRoomMessages);
    socket.on('typing_indicator', onTypingIndicator);
    socket.on('error', onError);

    // Clean up event listeners
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
      socket.off('user_joined', onUserJoined);
      socket.off('auth_error', onAuthError);
      socket.off('receive_message', onReceiveMessage);
      socket.off('private_message', onPrivateMessage);
      socket.off('message_delivered', onMessageDelivered);
      socket.off('message_updated', onMessageUpdated);
      socket.off('user_list', onUserList);
      socket.off('user_joined', onUserJoinedChat);
      socket.off('user_left', onUserLeft);
      socket.off('user_joined_room', onUserJoinedRoom);
      socket.off('rooms_list', onRoomsList);
      socket.off('room_created', onRoomCreated);
      socket.off('room_messages', onRoomMessages);
      socket.off('typing_indicator', onTypingIndicator);
      socket.off('error', onError);
    };
  }, [currentRoom, currentUser]);

  // Clear unread count when room changes
  useEffect(() => {
    setUnreadCounts((prev) => {
      const newCounts = new Map(prev);
      newCounts.set(currentRoom, 0);
      return newCounts;
    });
  }, [currentRoom]);

  return {
    socket,
    isConnected,
    currentUser,
    messages,
    users,
    rooms,
    currentRoom,
    typingUsers,
    privateMessages,
    unreadCounts,
    connect,
    disconnect,
    sendMessage,
    sendPrivateMessage,
    setTyping,
    joinRoom,
    createRoom,
    addReaction,
    markAsRead,
  };
};

export default socket; 