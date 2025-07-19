import React, { useState } from 'react';
import { format } from 'date-fns';
import { FiHeart, FiThumbsUp, FiSmile, FiFrown, FiMoreHorizontal } from 'react-icons/fi';

const Message = ({ message, isOwn, reactions }) => {
  const [showReactions, setShowReactions] = useState(false);

  // System message
  if (message.system) {
    return (
      <div className="flex justify-center">
        <div className="bg-secondary text-muted text-sm px-3 py-1 rounded-full">
          {message.content}
        </div>
      </div>
    );
  }

  // File message
  const isFile = message.type === 'file' && message.fileUrl;
  const isImage = isFile && /\.(jpg|jpeg|png|gif|webp)$/i.test(message.fileUrl);

  const handleReaction = (reactionType) => {
    // This would be handled by the parent component
    console.log('Reaction:', reactionType, message.id);
    setShowReactions(false);
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs sm:max-w-md lg:max-w-lg ${isOwn ? 'order-2' : 'order-1'}`}>
        {/* Sender name */}
        {!isOwn && (
          <div className="text-xs text-muted mb-1 ml-1">
            {message.sender}
          </div>
        )}

        {/* Message content */}
        <div className={`relative group ${isOwn ? 'ml-auto' : 'mr-auto'}`}>
          <div
            className={`rounded-lg px-3 py-2 ${
              isOwn
                ? 'bg-primary text-white'
                : 'bg-white border'
            }`}
          >
            {/* File/Image content */}
            {isFile && (
              <div className="mb-2">
                {isImage ? (
                  <img
                    src={message.fileUrl}
                    alt="Shared image"
                    className="max-w-full rounded cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => window.open(message.fileUrl, '_blank')}
                  />
                ) : (
                  <div className="flex items-center gap-2 p-2 bg-secondary rounded">
                    <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                      <span className="text-white text-xs font-medium">
                        {message.fileUrl.split('.').pop().toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {message.fileUrl.split('/').pop()}
                      </div>
                      <div className="text-xs text-muted">
                        Click to download
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Text content */}
            <div className="whitespace-pre-wrap break-words">
              {message.content}
            </div>

            {/* Message actions */}
            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setShowReactions(!showReactions)}
                className="p-1 hover:bg-black/10 rounded"
              >
                <FiMoreHorizontal className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Reactions popup */}
          {showReactions && (
            <div className="absolute bottom-full right-0 mb-2 bg-white border rounded-lg shadow-lg p-2 z-10">
              <div className="flex gap-1">
                {reactions.map((reaction) => {
                  const Icon = reaction.icon;
                  return (
                    <button
                      key={reaction.type}
                      onClick={() => handleReaction(reaction.type)}
                      className="p-2 hover:bg-secondary rounded transition-colors"
                      title={reaction.label}
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Message reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="message-reactions mt-1">
            {message.reactions.map((reaction, index) => {
              const reactionConfig = reactions.find(r => r.type === reaction.type);
              const Icon = reactionConfig?.icon || FiHeart;
              
              return (
                <div key={index} className="reaction">
                  <Icon className="w-3 h-3" />
                  <span>{reaction.username}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Timestamp */}
        <div className={`text-xs text-muted mt-1 ${isOwn ? 'text-right' : 'text-left'}`}>
          {format(new Date(message.timestamp), 'HH:mm')}
        </div>

        {/* Read receipts */}
        {isOwn && message.readBy && message.readBy.length > 0 && (
          <div className="text-xs text-muted text-right mt-1">
            Read by {message.readBy.join(', ')}
          </div>
        )}
      </div>
    </div>
  );
};

export default Message; 