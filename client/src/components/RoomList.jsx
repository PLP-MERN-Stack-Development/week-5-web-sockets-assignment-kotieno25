import React from 'react';
import { FiHash, FiX, FiPlus } from 'react-icons/fi';

const RoomList = ({ rooms, currentRoom, unreadCounts, onRoomSelect, onClose }) => {
  return (
    <div className="h-full flex flex-col bg-primary text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <h2 className="text-lg font-semibold">Rooms</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/10 rounded sm:hidden"
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>

      {/* Rooms List */}
      <div className="flex-1 overflow-y-auto">
        {rooms.length === 0 ? (
          <div className="flex items-center justify-center h-full text-white/60">
            <div className="text-center">
              <div className="text-4xl mb-2">#</div>
              <p>No rooms available</p>
            </div>
          </div>
        ) : (
          <div className="p-2">
            {rooms.map((room) => {
              const unreadCount = unreadCounts.get(room.id) || 0;
              const isActive = room.id === currentRoom;

              return (
                <button
                  key={room.id}
                  onClick={() => onRoomSelect(room.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors text-left ${
                    isActive
                      ? 'bg-white/20'
                      : 'hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <FiHash className="w-4 h-4 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {room.name}
                      </div>
                      <div className="text-xs text-white/60">
                        {room.userCount} members
                      </div>
                    </div>
                  </div>

                  {/* Unread count */}
                  {unreadCount > 0 && (
                    <div className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full min-w-[20px] text-center">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <div className="text-xs text-white/40 text-center">
          {rooms.length} room{rooms.length !== 1 ? 's' : ''} available
        </div>
      </div>
    </div>
  );
};

export default RoomList; 