import React, { useState } from 'react';
import { FiX, FiHash } from 'react-icons/fi';
import toast from 'react-hot-toast';

const CreateRoomModal = ({ isOpen, onClose, onCreateRoom }) => {
  const [roomName, setRoomName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!roomName.trim()) {
      toast.error('Please enter a room name');
      return;
    }

    if (roomName.trim().length < 3) {
      toast.error('Room name must be at least 3 characters long');
      return;
    }

    setIsCreating(true);
    
    try {
      await onCreateRoom(roomName.trim());
      setRoomName('');
      onClose();
      toast.success(`Room "${roomName.trim()}" created successfully!`);
    } catch (error) {
      toast.error('Failed to create room');
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    if (!isCreating) {
      setRoomName('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <FiHash className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-primary">
              Create New Room
            </h2>
          </div>
          <button
            onClick={handleClose}
            disabled={isCreating}
            className="p-1 hover:bg-secondary rounded transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="roomName" className="block text-sm font-medium text-primary mb-2">
                Room Name
              </label>
              <input
                id="roomName"
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="input"
                placeholder="Enter room name..."
                disabled={isCreating}
                autoFocus
                maxLength={50}
              />
              <div className="text-xs text-muted mt-1">
                {roomName.length}/50 characters
              </div>
            </div>

            <div className="bg-secondary p-3 rounded-lg">
              <h3 className="text-sm font-medium text-primary mb-2">
                Room Guidelines
              </h3>
              <ul className="text-xs text-muted space-y-1">
                <li>• Room names should be descriptive and clear</li>
                <li>• Avoid using special characters</li>
                <li>• Keep names under 50 characters</li>
                <li>• Be respectful and inclusive</li>
              </ul>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              disabled={isCreating}
              className="btn btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || !roomName.trim()}
              className="btn btn-primary flex-1"
            >
              {isCreating ? (
                <>
                  <div className="loading-spinner"></div>
                  Creating...
                </>
              ) : (
                'Create Room'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRoomModal; 