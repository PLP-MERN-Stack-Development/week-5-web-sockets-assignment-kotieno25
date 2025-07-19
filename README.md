# 🚀 Real-Time Chat Application with Socket.io

A modern, feature-rich real-time chat application built with React, Socket.io, and Express. This application demonstrates bidirectional communication between clients and server with advanced chat features.

## ✨ Features

### Core Functionality
- ✅ **Real-time messaging** using Socket.io
- ✅ **User authentication** with username-based login
- ✅ **Multiple chat rooms** with room creation and switching
- ✅ **Online/offline status** indicators
- ✅ **Typing indicators** when users are composing messages
- ✅ **Message timestamps** and read receipts

### Advanced Features
- ✅ **File sharing** - Upload and share images, PDFs, and documents
- ✅ **Message reactions** - React to messages with emojis (like, love, smile, sad)
- ✅ **Private messaging** - Send direct messages to other users
- ✅ **Unread message counts** - Track unread messages per room
- ✅ **Drag & drop file upload** - Easy file sharing interface
- ✅ **Responsive design** - Works on desktop and mobile devices

### User Experience
- ✅ **Real-time notifications** - Toast notifications for events
- ✅ **Connection status** - Visual indicators for server connection
- ✅ **Message delivery acknowledgment** - Confirm when messages are sent
- ✅ **Auto-scroll** - Messages automatically scroll to bottom
- ✅ **Modern UI** - Clean, intuitive interface with smooth animations

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks
- **Socket.io Client** - Real-time communication
- **React Router** - Client-side routing
- **React Icons** - Beautiful icon library
- **React Hot Toast** - Toast notifications
- **React Dropzone** - File upload handling
- **Date-fns** - Date formatting
- **Vite** - Fast build tool

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Socket.io** - Real-time bidirectional communication
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing
- **UUID** - Unique identifier generation

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Modern web browser

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd week-5-web-sockets-assignment-kotieno25
```

### 2. Install Server Dependencies
```bash
cd server
npm install
```

### 3. Install Client Dependencies
```bash
cd ../client
npm install
```

### 4. Start the Development Servers

#### Start the Server (Terminal 1)
```bash
cd server
npm run dev
```
Server will run on: `http://localhost:5000`

#### Start the Client (Terminal 2)
```bash
cd client
npm run dev
```
Client will run on: `http://localhost:5173`

### 5. Access the Application
Open your browser and navigate to `http://localhost:5173`

## 🎯 How to Use

### Getting Started
1. **Enter a username** on the login page (minimum 3 characters)
2. **Join the chat** - You'll be automatically connected to the General room
3. **Start messaging** - Type and send messages in real-time

### Chat Features
- **Switch rooms** - Click the room icon to view available rooms
- **Create rooms** - Click the plus icon to create new chat rooms
- **View users** - Click the users icon to see online/offline users
- **Share files** - Use the paperclip icon or drag & drop files
- **React to messages** - Hover over messages and click the three dots to add reactions
- **Private messages** - Send direct messages to other users

### File Sharing
- **Supported formats**: Images (JPG, PNG, GIF, WebP), PDFs, Documents (DOC, DOCX), Text files
- **File size limit**: 5MB per file
- **Drag & drop**: Simply drag files onto the chat area
- **Click to upload**: Use the paperclip icon to select files

## 📱 Screenshots

### Login Page
![Login Page](screenshots/login.png)

### Chat Interface
![Chat Interface](screenshots/chat.png)

### File Sharing
![File Sharing](screenshots/file-sharing.png)

### Mobile Responsive
![Mobile View](screenshots/mobile.png)

## 🔧 Project Structure

```
week-5-web-sockets-assignment-kotieno25/
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── MessageList.jsx
│   │   │   ├── Message.jsx
│   │   │   ├── MessageInput.jsx
│   │   │   ├── UserList.jsx
│   │   │   ├── RoomList.jsx
│   │   │   └── CreateRoomModal.jsx
│   │   ├── pages/              # Page components
│   │   │   ├── Login.jsx
│   │   │   └── Chat.jsx
│   │   ├── socket/             # Socket.io client setup
│   │   │   └── socket.js
│   │   ├── App.jsx             # Main app component
│   │   ├── main.jsx            # App entry point
│   │   ├── index.css           # Global styles
│   │   └── App.css             # App-specific styles
│   ├── package.json            # Frontend dependencies
│   ├── vite.config.js          # Vite configuration
│   └── index.html              # HTML template
├── server/                     # Node.js backend
│   ├── config/                 # Configuration files
│   │   └── config.js
│   ├── controllers/            # Socket event handlers
│   │   └── socketController.js
│   ├── utils/                  # Utility functions
│   │   └── auth.js
│   ├── uploads/                # File upload directory
│   ├── server.js               # Main server file
│   └── package.json            # Backend dependencies
├── README.md                   # Project documentation
└── Week5-Assignment.md         # Assignment instructions
```

## 🌟 Key Features Implementation

### 1. Real-Time Communication
- **Socket.io integration** for instant message delivery
- **Connection management** with automatic reconnection
- **Event-driven architecture** for scalable communication

### 2. User Management
- **Username-based authentication** with duplicate prevention
- **Online/offline status** tracking
- **User presence indicators** with real-time updates

### 3. Room System
- **Multiple chat rooms** with dynamic creation
- **Room switching** with message history
- **Unread message tracking** per room

### 4. File Sharing
- **Secure file upload** with size and type validation
- **Image preview** for supported formats
- **File download** functionality for documents

### 5. Message Features
- **Message reactions** with emoji support
- **Read receipts** for message acknowledgment
- **Typing indicators** for real-time feedback
- **Message timestamps** and formatting

### 6. User Experience
- **Responsive design** for all device sizes
- **Smooth animations** and transitions
- **Toast notifications** for user feedback
- **Loading states** and error handling

## 🚀 Performance Optimizations

- **Message pagination** - Load only recent messages
- **File size limits** - Prevent memory issues
- **Connection pooling** - Efficient Socket.io usage
- **Lazy loading** - Load components on demand
- **Memory management** - Clean up event listeners

## 🔒 Security Features

- **Input validation** - Sanitize user inputs
- **File type validation** - Prevent malicious uploads
- **CORS configuration** - Secure cross-origin requests
- **Error handling** - Graceful error management

## 📊 API Endpoints

### Server Endpoints
- `GET /` - Server status
- `GET /api/rooms` - Get all rooms
- `GET /api/users` - Get online users
- `GET /api/rooms/:roomId/messages` - Get room messages
- `POST /api/upload` - Upload files

### Socket Events
- `user_join` - User authentication
- `send_message` - Send chat message
- `private_message` - Send private message
- `typing` - Typing indicator
- `join_room` - Join chat room
- `create_room` - Create new room
- `message_reaction` - Add message reaction
- `mark_read` - Mark message as read

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Real-time message sending/receiving
- [ ] Room creation and switching
- [ ] File upload and sharing
- [ ] Message reactions
- [ ] Typing indicators
- [ ] Online/offline status
- [ ] Mobile responsiveness
- [ ] Connection handling
- [ ] Error scenarios

## 🚀 Deployment

### Prerequisites
- Node.js hosting service (Render, Railway, Heroku)
- Frontend hosting service (Vercel, Netlify, GitHub Pages)

### Environment Variables
```env
PORT=5000
CLIENT_URL=http://localhost:5173
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=production
```

### Deployment Steps
1. **Deploy Backend** to your preferred Node.js hosting service
2. **Update client configuration** with production server URL
3. **Deploy Frontend** to your preferred static hosting service
4. **Configure environment variables** for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Socket.io](https://socket.io/) for real-time communication
- [React](https://react.dev/) for the frontend framework
- [Express.js](https://expressjs.com/) for the backend framework
- [React Icons](https://react-icons.github.io/react-icons/) for beautiful icons
- [React Hot Toast](https://react-hot-toast.com/) for notifications

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page for existing solutions
2. Create a new issue with detailed information
3. Contact the development team

---

**Built with ❤️ for Week 5 Assignment - Real-Time Communication with Socket.io** 