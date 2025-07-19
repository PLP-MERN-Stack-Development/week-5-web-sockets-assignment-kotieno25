import React, { useState, useRef } from 'react';
import { FiSend, FiSmile, FiPaperclip } from 'react-icons/fi';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import EmojiPicker from 'emoji-picker-react';

const MessageInput = ({ onSendMessage, onTypingChange, disabled }) => {
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim() || disabled) return;

    onSendMessage(message.trim());
    setMessage('');
    setShowEmojiPicker(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    onTypingChange(e.target.value.length > 0);
  };

  const handleFileUpload = async (files) => {
    if (files.length === 0) return;

    const file = files[0];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (file.size > maxSize) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      
      // Send file message
      onSendMessage(`Shared a file: ${file.name}`, undefined, {
        type: 'file',
        fileUrl: data.fileUrl,
        fileName: file.name,
        fileSize: file.size
      });

      toast.success('File uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFileUpload,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxFiles: 1,
    disabled: disabled || isUploading
  });

  const handleEmojiClick = (emojiData) => {
    const emoji = emojiData.emoji;
    // Insert emoji at cursor position
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = message.slice(0, start) + emoji + message.slice(end);
      setMessage(newValue);
      // Move cursor after emoji
      setTimeout(() => {
        textarea.focus();
        textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
      }, 0);
    } else {
      setMessage((prev) => prev + emoji);
    }
    setShowEmojiPicker(false);
    onTypingChange(true);
  };

  return (
    <div className="p-4 relative">
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        {/* File Upload Area */}
        <div
          {...getRootProps()}
          className={`file-upload flex-shrink-0 ${isDragActive ? 'dragover' : ''}`}
          style={{ display: 'none' }}
        >
          <input {...getInputProps()} />
        </div>

        {/* Message Input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="input resize-none"
            rows="1"
            disabled={disabled || isUploading}
            style={{
              minHeight: '44px',
              maxHeight: '120px',
              paddingRight: '80px'
            }}
          />
          
          {/* Character count */}
          {message.length > 0 && (
            <div className="absolute bottom-1 right-1 text-xs text-muted">
              {message.length}/1000
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 relative">
          {/* File Upload Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isUploading}
            className="p-2 text-muted hover:text-primary hover:bg-secondary rounded transition-colors"
            title="Attach file"
          >
            {isUploading ? (
              <div className="loading-spinner"></div>
            ) : (
              <FiPaperclip className="w-5 h-5" />
            )}
          </button>

          {/* Emoji Button */}
          <button
            type="button"
            disabled={disabled}
            className="p-2 text-muted hover:text-primary hover:bg-secondary rounded transition-colors"
            title="Add emoji"
            onClick={() => setShowEmojiPicker((v) => !v)}
          >
            <FiSmile className="w-5 h-5" />
          </button>

          {/* Emoji Picker Popup */}
          {showEmojiPicker && (
            <div className="emoji-picker absolute bottom-full right-0 mb-2 z-50">
              <EmojiPicker onEmojiClick={handleEmojiClick} theme="light" height={350} width={300} />
            </div>
          )}

          {/* Send Button */}
          <button
            type="submit"
            disabled={disabled || !message.trim() || isUploading}
            className="p-2 bg-primary text-white rounded hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Send message"
          >
            <FiSend className="w-5 h-5" />
          </button>
        </div>
      </form>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={(e) => handleFileUpload(e.target.files)}
        accept="image/*,.pdf,.doc,.docx,.txt"
        style={{ display: 'none' }}
      />

      {/* Drag and drop overlay */}
      {isDragActive && (
        <div className="fixed inset-0 bg-primary/20 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <FiPaperclip className="w-12 h-12 text-primary mx-auto mb-4" />
            <p className="text-lg font-medium">Drop file to upload</p>
            <p className="text-sm text-muted">Supports images, PDFs, and documents</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageInput; 