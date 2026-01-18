import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Trash2 } from 'lucide-react';
import { formatDateTime, getInitials } from '../../utils/helpers';
import commentService from '../../services/commentService';
import toast from 'react-hot-toast';

const CommentItem = ({ comment, taskId, onDelete }) => {
  const { user } = useSelector((state) => state.auth);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const isOwner = comment.user.id === user?.id;

  const handleDelete = async () => {
    if (!window.confirm('Delete this comment?')) return;
    
    setIsDeleting(true);
    try {
      await commentService.deleteComment(taskId, comment.id);
      toast.success('Comment deleted');
      if (onDelete) onDelete(comment.id);
    } catch (error) {
      toast.error('Failed to delete comment');
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex gap-3 p-4 bg-gray-50 rounded-lg">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold text-sm">
          {getInitials(comment.user.fullName)}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-1">
          <div>
            <p className="text-sm font-medium text-gray-900">
              {comment.user.fullName}
            </p>
            <p className="text-xs text-gray-500">
              {formatDateTime(comment.createdAt)}
            </p>
          </div>
          
          {isOwner && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              title="Delete comment"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
        
        <p className="text-sm text-gray-700 whitespace-pre-wrap">
          {comment.content}
        </p>
      </div>
    </div>
  );
};

export default CommentItem;
