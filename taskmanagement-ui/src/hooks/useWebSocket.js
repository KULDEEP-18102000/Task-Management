import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import websocketService from '../services/websocketService';
import { addNotification, fetchUnreadCount } from '../store/slices/notificationSlice';
import { fetchTasks } from '../store/slices/taskSlice';
import toast from 'react-hot-toast';

export const useWebSocket = () => {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);

  const connect = useCallback(() => {
    if (!token || !user) return;

    websocketService.connect(
      token,
      () => {
        console.log('WebSocket connected successfully');
        
        // Subscribe to user-specific notifications
        websocketService.subscribe(
          `/topic/user/${user.id}/notifications`,
          (notification) => {
            console.log('Received notification:', notification);
            dispatch(addNotification(notification));
            dispatch(fetchUnreadCount());
            
            // Show toast notification
            toast.success(notification.title, {
              description: notification.message,
            });
          }
        );

        // Subscribe to global task updates
        websocketService.subscribe('/topic/tasks', (message) => {
          console.log('Task update:', message);
          
          // Refresh tasks on any update
          if (message.type === 'CREATED' || message.type === 'UPDATED' || message.type === 'DELETED') {
            dispatch(fetchTasks());
          }
        });
      },
      (error) => {
        console.error('WebSocket connection error:', error);
      }
    );
  }, [token, user, dispatch]);

  const disconnect = useCallback(() => {
    websocketService.disconnect();
  }, []);

  const subscribeToProject = useCallback((projectId) => {
    if (!websocketService.isConnected()) return;

    websocketService.subscribe(
      `/topic/project/${projectId}/tasks`,
      (message) => {
        console.log('Project task update:', message);
        dispatch(fetchTasks());
      }
    );
  }, [dispatch]);

  const subscribeToTaskComments = useCallback((taskId, onComment) => {
    if (!websocketService.isConnected()) return;

    return websocketService.subscribe(
      `/topic/task/${taskId}/comments`,
      (comment) => {
        console.log('New comment:', comment);
        if (onComment) onComment(comment);
      }
    );
  }, []);

  useEffect(() => {
    if (token && user) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [token, user, connect, disconnect]);

  return {
    isConnected: websocketService.isConnected(),
    subscribeToProject,
    subscribeToTaskComments,
  };
};
