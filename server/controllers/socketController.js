const { v4: uuidv4 } = require('uuid');
const { verifyToken } = require('../utils/auth');

class SocketController {
  constructor(io) {
    this.io = io;
    this.users = new Map();
    this.rooms = new Map();
    this.messages = new Map();
    this.typingUsers = new Map();
    this.privateMessages = new Map();
    
    // Initialize default room
    this.rooms.set('general', {
      id: 'general',
      name: 'General',
      messages: [],
      users: new Set()
    });
  }

  handleConnection(socket) {
    console.log(`User connected: ${socket.id}`);

    // Join default room
    socket.join('general');
    this.rooms.get('general').users.add(socket.id);

    // Send initial data
    socket.emit('rooms_list', Array.from(this.rooms.values()).map(room => ({
      id: room.id,
      name: room.name,
      userCount: room.users.size
    })));

    this.setupEventHandlers(socket);
  }

  setupEventHandlers(socket) {
    // User authentication
    socket.on('authenticate', (token) => {
      const userData = verifyToken(token);
      if (userData) {
        this.users.set(socket.id, {
          id: socket.id,
          username: userData.username,
          avatar: userData.avatar || null,
          isOnline: true,
          lastSeen: new Date().toISOString()
        });
        
        socket.emit('authenticated', this.users.get(socket.id));
        this.broadcastUserList();
        this.broadcastUserJoined(this.users.get(socket.id));
      } else {
        socket.emit('auth_error', 'Invalid token');
      }
    });

    // Simple username-based auth
    socket.on('user_join', (username) => {
      if (!username || username.trim().length === 0) {
        socket.emit('error', 'Username is required');
        return;
      }

      // Check if username is already taken
      const existingUser = Array.from(this.users.values()).find(
        user => user.username === username
      );
      
      if (existingUser) {
        socket.emit('error', 'Username already taken');
        return;
      }

      this.users.set(socket.id, {
        id: socket.id,
        username: username.trim(),
        avatar: null,
        isOnline: true,
        lastSeen: new Date().toISOString()
      });

      socket.emit('user_joined', this.users.get(socket.id));
      this.broadcastUserList();
      this.broadcastUserJoined(this.users.get(socket.id));
    });

    // Send message
    socket.on('send_message', (messageData) => {
      const user = this.users.get(socket.id);
      if (!user) {
        socket.emit('error', 'User not authenticated');
        return;
      }

      const message = {
        id: uuidv4(),
        sender: user.username,
        senderId: socket.id,
        content: messageData.content,
        roomId: messageData.roomId || 'general',
        timestamp: new Date().toISOString(),
        type: messageData.type || 'text',
        fileUrl: messageData.fileUrl || null,
        reactions: []
      };

      // Store message
      const room = this.rooms.get(message.roomId);
      if (room) {
        room.messages.push(message);
        // Keep only last 100 messages per room
        if (room.messages.length > 100) {
          room.messages.shift();
        }
      }

      // Broadcast to room
      this.io.to(message.roomId).emit('receive_message', message);
      
      // Send delivery acknowledgment
      socket.emit('message_delivered', { messageId: message.id });
    });

    // Private message
    socket.on('private_message', (data) => {
      const user = this.users.get(socket.id);
      if (!user) {
        socket.emit('error', 'User not authenticated');
        return;
      }

      const targetUser = Array.from(this.users.values()).find(
        u => u.username === data.to
      );

      if (!targetUser) {
        socket.emit('error', 'User not found');
        return;
      }

      const message = {
        id: uuidv4(),
        sender: user.username,
        senderId: socket.id,
        recipient: data.to,
        recipientId: targetUser.id,
        content: data.content,
        timestamp: new Date().toISOString(),
        type: 'private',
        reactions: []
      };

      // Store private message
      const conversationId = [user.username, data.to].sort().join('-');
      if (!this.privateMessages.has(conversationId)) {
        this.privateMessages.set(conversationId, []);
      }
      this.privateMessages.get(conversationId).push(message);

      // Send to both users
      socket.emit('private_message', message);
      this.io.to(targetUser.id).emit('private_message', message);
    });

    // Typing indicator
    socket.on('typing', (data) => {
      const user = this.users.get(socket.id);
      if (!user) return;

      const typingData = {
        username: user.username,
        roomId: data.roomId || 'general',
        isTyping: data.isTyping
      };

      if (data.isTyping) {
        this.typingUsers.set(socket.id, typingData);
      } else {
        this.typingUsers.delete(socket.id);
      }

      socket.to(data.roomId || 'general').emit('typing_indicator', typingData);
    });

    // Join room
    socket.on('join_room', (roomId) => {
      const user = this.users.get(socket.id);
      if (!user) return;

      // Leave current room
      socket.rooms.forEach(room => {
        if (room !== socket.id) {
          socket.leave(room);
          const currentRoom = this.rooms.get(room);
          if (currentRoom) {
            currentRoom.users.delete(socket.id);
          }
        }
      });

      // Join new room
      socket.join(roomId);
      
      if (!this.rooms.has(roomId)) {
        this.rooms.set(roomId, {
          id: roomId,
          name: roomId,
          messages: [],
          users: new Set()
        });
      }
      
      this.rooms.get(roomId).users.add(socket.id);

      // Send room messages
      const room = this.rooms.get(roomId);
      socket.emit('room_messages', room.messages);
      
      // Notify others in room
      socket.to(roomId).emit('user_joined_room', {
        username: user.username,
        roomId: roomId
      });
    });

    // Create room
    socket.on('create_room', (roomData) => {
      const user = this.users.get(socket.id);
      if (!user) return;

      const roomId = uuidv4();
      const room = {
        id: roomId,
        name: roomData.name,
        createdBy: user.username,
        messages: [],
        users: new Set([socket.id])
      };

      this.rooms.set(roomId, room);
      
      socket.join(roomId);
      this.io.emit('room_created', {
        id: roomId,
        name: roomData.name,
        createdBy: user.username,
        userCount: 1
      });
    });

    // Message reaction
    socket.on('message_reaction', (data) => {
      const user = this.users.get(socket.id);
      if (!user) return;

      const { messageId, reaction, roomId } = data;
      const room = this.rooms.get(roomId);
      
      if (room) {
        const message = room.messages.find(m => m.id === messageId);
        if (message) {
          const existingReaction = message.reactions.find(
            r => r.userId === socket.id && r.type === reaction
          );
          
          if (existingReaction) {
            // Remove reaction
            message.reactions = message.reactions.filter(
              r => !(r.userId === socket.id && r.type === reaction)
            );
          } else {
            // Add reaction
            message.reactions.push({
              userId: socket.id,
              username: user.username,
              type: reaction,
              timestamp: new Date().toISOString()
            });
          }
          
          this.io.to(roomId).emit('message_updated', message);
        }
      }
    });

    // Read receipts
    socket.on('mark_read', (data) => {
      const user = this.users.get(socket.id);
      if (!user) return;

      const { messageId, roomId } = data;
      const room = this.rooms.get(roomId);
      
      if (room) {
        const message = room.messages.find(m => m.id === messageId);
        if (message && !message.readBy) {
          message.readBy = message.readBy || [];
          if (!message.readBy.includes(user.username)) {
            message.readBy.push(user.username);
            this.io.to(roomId).emit('message_updated', message);
          }
        }
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      const user = this.users.get(socket.id);
      if (user) {
        user.isOnline = false;
        user.lastSeen = new Date().toISOString();
        
        this.broadcastUserLeft(user);
        this.users.delete(socket.id);
        this.typingUsers.delete(socket.id);
        
        // Remove from all rooms
        this.rooms.forEach(room => {
          room.users.delete(socket.id);
        });
        
        this.broadcastUserList();
      }
      
      console.log(`User disconnected: ${socket.id}`);
    });
  }

  broadcastUserList() {
    const userList = Array.from(this.users.values()).map(user => ({
      id: user.id,
      username: user.username,
      avatar: user.avatar,
      isOnline: user.isOnline,
      lastSeen: user.lastSeen
    }));
    
    this.io.emit('user_list', userList);
  }

  broadcastUserJoined(user) {
    this.io.emit('user_joined', {
      username: user.username,
      id: user.id,
      timestamp: new Date().toISOString()
    });
  }

  broadcastUserLeft(user) {
    this.io.emit('user_left', {
      username: user.username,
      id: user.id,
      timestamp: new Date().toISOString()
    });
  }

  getRoomsList() {
    return Array.from(this.rooms.values()).map(room => ({
      id: room.id,
      name: room.name,
      userCount: room.users.size
    }));
  }

  getRoomMessages(roomId) {
    const room = this.rooms.get(roomId);
    return room ? room.messages : [];
  }

  getPrivateMessages(user1, user2) {
    const conversationId = [user1, user2].sort().join('-');
    return this.privateMessages.get(conversationId) || [];
  }
}

module.exports = SocketController; 