import React, { useState } from 'react';
import { Send } from 'lucide-react';
import Button from '../common/Button';
import commentService from '../../services/commentService';
import toast from 'react-hot-toast';

const CommentForm = ({ taskId, onCommentAdded }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    if (content.length > 2000) {
      toast.error('Comment is too long (max 2000 characters)');
      return;
    }

    setLoading(true);
    try {
      const newComment = await commentService.createComment(taskId, content);
      setContent('');
      if (onCommentAdded) {
        onCommentAdded(newComment);
      }
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add a comment..."
        rows="3"
        disabled={loading}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
      />
      
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500">
          {content.length}/2000 characters
        </span>
        
        <Button
          type="submit"
          size="sm"
          loading={loading}
          disabled={!content.trim() || loading}
        >
          <Send size={16} />
          Post Comment
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;
