import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Bell, CheckCheck } from 'lucide-react';
import NotificationItem from './NotificationItem';
import Button from '../common/Button';
import Loader from '../common/Loader';
import { 
  fetchNotifications, 
  fetchUnreadNotifications,
  markAllAsRead 
} from '../../store/slices/notificationSlice';

const NotificationPanel = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { notifications, loading } = useSelector((state) => state.notifications);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (showUnreadOnly) {
        dispatch(fetchUnreadNotifications());
      } else {
        dispatch(fetchNotifications());
      }
    }
  }, [isOpen, showUnreadOnly, dispatch]);

  const handleMarkAllRead = () => {
    dispatch(markAllAsRead());
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Bell size={20} className="text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Notifications
            </h2>
          </div>
          
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setShowUnreadOnly(false)}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              !showUnreadOnly
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setShowUnreadOnly(true)}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              showUnreadOnly
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Unread
          </button>
        </div>

        {/* Actions */}
        {notifications.length > 0 && (
          <div className="p-4 border-b border-gray-200">
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllRead}
              fullWidth
            >
              <CheckCheck size={16} />
              Mark All as Read
            </Button>
          </div>
        )}

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader size="md" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-12 px-4">
              <Bell size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">
                {showUnreadOnly
                  ? 'No unread notifications'
                  : 'No notifications yet'}
              </p>
            </div>
          ) : (
            <div>
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationPanel;
