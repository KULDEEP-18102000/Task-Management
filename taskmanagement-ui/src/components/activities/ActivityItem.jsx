import React from 'react';
import { 
  CheckSquare, 
  Edit, 
  Trash2, 
  UserPlus, 
  UserMinus, 
  MessageSquare,
  Folder,
  Flag
} from 'lucide-react';
import { formatDateTime } from '../../utils/helpers';
import { ACTIVITY_TYPES } from '../../utils/constants';

const ActivityItem = ({ activity }) => {
  const getActivityIcon = (type) => {
    const iconProps = { size: 18, className: 'flex-shrink-0' };
    
    switch (type) {
      case ACTIVITY_TYPES.TASK_CREATED:
        return <CheckSquare {...iconProps} className="text-green-600" />;
      case ACTIVITY_TYPES.TASK_UPDATED:
        return <Edit {...iconProps} className="text-blue-600" />;
      case ACTIVITY_TYPES.TASK_DELETED:
        return <Trash2 {...iconProps} className="text-red-600" />;
      case ACTIVITY_TYPES.TASK_ASSIGNED:
        return <UserPlus {...iconProps} className="text-purple-600" />;
      case ACTIVITY_TYPES.TASK_COMPLETED:
        return <Flag {...iconProps} className="text-green-600" />;
      case ACTIVITY_TYPES.COMMENT_ADDED:
        return <MessageSquare {...iconProps} className="text-blue-600" />;
      case ACTIVITY_TYPES.PROJECT_CREATED:
      case ACTIVITY_TYPES.PROJECT_UPDATED:
        return <Folder {...iconProps} className="text-orange-600" />;
      case ACTIVITY_TYPES.MEMBER_ADDED:
        return <UserPlus {...iconProps} className="text-green-600" />;
      case ACTIVITY_TYPES.MEMBER_REMOVED:
        return <UserMinus {...iconProps} className="text-red-600" />;
      default:
        return <CheckSquare {...iconProps} className="text-gray-600" />;
    }
  };

  return (
    <div className="flex gap-3 py-3 border-b border-gray-100 last:border-0">
      {/* Icon */}
      <div className="flex-shrink-0 mt-1">
        {getActivityIcon(activity.type)}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900">
          {activity.description}
        </p>
        
        {/* Metadata */}
        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
          <span>{formatDateTime(activity.createdAt)}</span>
          
          {activity.project && (
            <>
              <span>•</span>
              <span className="text-primary-600">
                {activity.project.name}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityItem;
