import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  CheckSquare, 
  MessageSquare, 
  UserPlus, 
  Clock, 
  AlertCircle 
} from 'lucide-react';
import { markAsRead } from '../../store/slices/notificationSlice';
import { formatDateTime } from '../../utils/helpers';
import { NOTIFICATION_TYPES } from '../../utils/constants';

const NotificationItem = ({ notification }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getNotificationIcon = (type) => {
    const iconProps = { size: 18 };
    
    switch (type) {
      case NOTIFICATION_TYPES.TASK_ASSIGNED:
        return <CheckSquare {...iconProps} className="text-blue-600" />;
      case NOTIFICATION_TYPES.TASK_UPDATED:
        return <Bell {...iconProps} className="text-purple-600" />;
      case NOTIFICATION_TYPES.COMMENT_ADDED:
        return <MessageSquare {...iconProps} className="text-green-600" />;
      case NOTIFICATION_TYPES.PROJECT_INVITE:
        return <UserPlus {...iconProps} className="text-orange-600" />;
      case NOTIFICATION_TYPES.TASK_DUE_SOON:
        return <Clock {...iconProps} className="text-yellow-600" />;
      case NOTIFICATION_TYPES.TASK_OVERDUE:
        return <AlertCircle {...iconProps} className="text-red-600" />;
      default:
        return <Bell {...iconProps} className="text-gray-600" />;
    }
  };

  const handleClick = async () => {
    // Mark as read
    if (!notification.isRead) {
      dispatch(markAsRead(notification.id));
    }

    // Navigate to relevant page
    if (notification.task) {
      navigate(`/tasks/${notification.task.id}`);
    } else if (notification.project) {
      navigate(`/projects/${notification.project.id}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`
        flex gap-3 p-4 cursor-pointer transition-colors
        ${notification.isRead ? 'bg-white' : 'bg-blue-50'}
        hover:bg-gray-50 border-b border-gray-100 last:border-0
      `}
    >
      {/* Icon */}
      <div className="flex-shrink-0 mt-1">
        {getNotificationIcon(notification.type)}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">
              {notification.title}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {notification.message}
            </p>
          </div>
          
          {!notification.isRead && (
            <div className="flex-shrink-0">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            </div>
          )}
        </div>
        
        <p className="text-xs text-gray-500 mt-2">
          {formatDateTime(notification.createdAt)}
        </p>
      </div>
    </div>
  );
};

export default NotificationItem;
