import api from '../api/axios';
import { API_ENDPOINTS } from '../utils/constants';

class TaskService {
  // Get all tasks for current user
  async getAllTasks() {
    const response = await api.get(API_ENDPOINTS.TASKS);
    return response.data;
  }

  // Get single task by ID
  async getTaskById(id) {
    const response = await api.get(API_ENDPOINTS.TASK_BY_ID(id));
    return response.data;
  }

  // Create new task
  async createTask(taskData) {
    const response = await api.post(API_ENDPOINTS.TASKS, taskData);
    return response.data;
  }

  // Update task
  async updateTask(id, taskData) {
    const response = await api.put(API_ENDPOINTS.TASK_BY_ID(id), taskData);
    return response.data;
  }

  // Delete task
  async deleteTask(id) {
    const response = await api.delete(API_ENDPOINTS.TASK_BY_ID(id));
    return response.data;
  }
}

export default new TaskService();