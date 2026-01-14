import React, { useState, useEffect } from 'react';
import { Activity as ActivityIcon, RefreshCw } from 'lucide-react';
import ActivityItem from './ActivityItem';
import Loader from '../common/Loader';
import Button from '../common/Button';
import activityService from '../../services/activityService';

const ActivityFeed = ({ type = 'recent', taskId, projectId, limit = 20 }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchActivities();
  }, [type, taskId, projectId, limit]);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      let data;
      
      switch (type) {
        case 'task':
          data = await activityService.getTaskActivities(taskId);
          break;
        case 'project':
          data = await activityService.getProjectActivities(projectId);
          break;
        case 'user':
          data = await activityService.getUserActivities(limit);
          break;
        default:
          data = await activityService.getRecentActivities(limit);
      }
      
      setActivities(data);
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchActivities();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader size="md" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <ActivityIcon size={20} className="text-gray-600" />
          <h3 className="font-semibold text-gray-900">Activity Feed</h3>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
        </Button>
      </div>

      {/* Activities List */}
      <div className="p-4">
        {activities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <ActivityIcon size={48} className="mx-auto mb-2 text-gray-400" />
            <p>No activity yet</p>
          </div>
        ) : (
          <div className="space-y-0">
            {activities.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;
