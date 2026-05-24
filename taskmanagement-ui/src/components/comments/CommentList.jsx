import React, { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { MessageSquare } from 'lucide-react';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import Loader from '../common/Loader';
import commentService from '../../services/commentService';
import { useWebSocket } from '../../hooks/useWebSocket';

const CommentList = ({ taskId }) => {
  const queryClient = useQueryClient();
  const { subscribeToTaskComments } = useWebSocket();

  // Fetch Comments
  const { data: comments = [], isLoading: loading } = useQuery({
    queryKey: ['comments', taskId],
    queryFn: () => commentService.getTaskComments(taskId),
    enabled: !!taskId,
  });

  useEffect(() => {
    // Subscribe to real-time comments
    const subscription = subscribeToTaskComments(taskId, (newComment) => {
      // Update cache manually for real-time feel
      queryClient.setQueryData(['comments', taskId], (oldComments = []) => {
        // Prevent duplicate comments (if socket and optimistic update both fire)
        if (oldComments.some(c => c.id === newComment.id)) return oldComments;
        return [newComment, ...oldComments];
      });
    });

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [taskId, subscribeToTaskComments, queryClient]);

  const handleCommentAdded = (newComment) => {
    // The socket will usually handle this, but we can do it here too if needed
    queryClient.setQueryData(['comments', taskId], (old = []) => [newComment, ...old]);
  };

  const handleCommentDeleted = (commentId) => {
    queryClient.setQueryData(['comments', taskId], (old = []) => 
      old.filter(c => c.id !== commentId)
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader size="md" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Comment Form */}
      <CommentForm taskId={taskId} onCommentAdded={handleCommentAdded} />

      {/* Comments Header */}
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <MessageSquare size={18} />
        <span>{comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}</span>
      </div>

      {/* Comments List */}
      {comments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <MessageSquare size={48} className="mx-auto mb-2 text-gray-400" />
          <p>No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              taskId={taskId}
              onDelete={handleCommentDeleted}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentList;
