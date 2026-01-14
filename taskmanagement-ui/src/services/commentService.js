import api from '../api/axios';
import { API_ENDPOINTS } from '../utils/constants';

class CommentService {
  // Get comments for a task
  async getTaskComments(taskId) {
    const response = await api.get(API_ENDPOINTS.TASK_COMMENTS(taskId));
    return response.data;
  }

  // Create a comment
  async createComment(taskId, content) {
    const response = await api.post(API_ENDPOINTS.TASK_COMMENTS(taskId), { content });
    return response.data;
  }

  // Delete a comment
  async deleteComment(taskId, commentId) {
    const response = await api.delete(API_ENDPOINTS.DELETE_COMMENT(taskId, commentId));
    return response.data;
  }
}

export default new CommentService();
