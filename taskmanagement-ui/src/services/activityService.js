import api from '../api/axios';
import { API_ENDPOINTS } from '../utils/constants';

class ActivityService {
  // Get recent activities
  async getRecentActivities(limit = 20) {
    const response = await api.get(`${API_ENDPOINTS.RECENT_ACTIVITIES}?limit=${limit}`);
    return response.data;
  }

  // Get task activities
  async getTaskActivities(taskId) {
    const response = await api.get(API_ENDPOINTS.TASK_ACTIVITIES(taskId));
    return response.data;
  }

  // Get project activities
  async getProjectActivities(projectId) {
    const response = await api.get(API_ENDPOINTS.PROJECT_ACTIVITIES(projectId));
    return response.data;
  }

  // Get user activities
  async getUserActivities(limit = 20) {
    const response = await api.get(`${API_ENDPOINTS.USER_ACTIVITIES}?limit=${limit}`);
    return response.data;
  }
}

export default new ActivityService();
