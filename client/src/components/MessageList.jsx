import React, { useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { FiHeart, FiThumbsUp, FiSmile, FiFrown } from 'react-icons/fi';
import Message from './Message';

const MessageList = ({ messages, currentUser, typingUsers }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const reactions = [
    { type: 'like', icon: FiThumbsUp, label: 'Like' },
    { type: 'love', icon: FiHeart, label: 'Love' },
    { type: 'smile', icon: FiSmile, label: 'Smile' },
    { type: 'sad', icon: FiFrown, label: 'Sad' },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto chat-scrollbar p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted">
            <div className="text-center">
              <div className="text-4xl mb-2">💬</div>
              <p className="text-lg font-medium">No messages yet</p>
              <p className="text-sm">Start the conversation!</p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <Message
              key={message.id}
              message={message}
              isOwn={message.sender === currentUser?.username}
              reactions={reactions}
            />
          ))
        )}

        {/* Typing Indicators */}
        {typingUsers.length > 0 && (
          <div className="typing-indicator">
            <span className="text-sm text-muted">
              {typingUsers.map(user => user.username).join(', ')} 
              {typingUsers.length === 1 ? ' is ' : ' are '} 
              typing
            </span>
            <div className="typing-dots">
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
            </div>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList; 