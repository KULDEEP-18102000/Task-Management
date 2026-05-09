import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import websocketService from '../services/websocketService';
import toast from 'react-hot-toast';

export const useWebSocket = () => {
  const queryClient = useQueryClient();
  const { token, user } = useAuth();

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
            // Invalidate notifications to trigger a fresh fetch
            queryClient.invalidateQueries(['notifications']);
            
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
            queryClient.invalidateQueries(['tasks']);
            queryClient.invalidateQueries(['dashboard']);
          }
        });
      },
      (error) => {
        console.error('WebSocket connection error:', error);
      }
    );
  }, [token, user, queryClient]);

  const disconnect = useCallback(() => {
    websocketService.disconnect();
  }, []);

  const subscribeToProject = useCallback((projectId) => {
    if (!websocketService.isConnected()) return;

    websocketService.subscribe(
      `/topic/project/${projectId}/tasks`,
      (message) => {
        console.log('Project task update:', message);
        queryClient.invalidateQueries(['tasks']);
        queryClient.invalidateQueries(['projects']);
      }
    );
  }, [queryClient]);

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

