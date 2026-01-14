import React, { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import Loader from '../common/Loader';
import commentService from '../../services/commentService';
import { useWebSocket } from '../../hooks/useWebSocket';

const CommentList = ({ taskId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { subscribeToTaskComments } = useWebSocket();

  useEffect(() => {
    fetchComments();

    // Subscribe to real-time comments
    const subscription = subscribeToTaskComments(taskId, (newComment) => {
      setComments((prev) => [newComment, ...prev]);
    });

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [taskId, subscribeToTaskComments]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const data = await commentService.getTaskComments(taskId);
      setComments(data);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentAdded = (newComment) => {
    setComments((prev) => [newComment, ...prev]);
  };

  const handleCommentDeleted = (commentId) => {
    setComments((prev) => prev.filter(c => c.id !== commentId));
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
