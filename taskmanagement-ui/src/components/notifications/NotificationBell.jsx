import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bell } from 'lucide-react';
import notificationService from '../../services/notificationService';
import NotificationPanel from './NotificationPanel';

const NotificationBell = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // Fetch unread count with polling
  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => notificationService.getUnreadCount(),
    refetchInterval: 30000, // Poll every 30 seconds
  });

  return (
    <>
      <button
        onClick={() => setIsPanelOpen(true)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
      >
        <Bell size={24} />
        
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <NotificationPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
      />
    </>
  );
};

export default NotificationBell;
