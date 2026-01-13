import api from '../api/axios';
import { API_ENDPOINTS } from '../utils/constants';

class UserService {
  // Get all users
  async getAllUsers() {
    const response = await api.get(API_ENDPOINTS.USERS);
    return response.data;
  }

  // Get team members (all users except current)
  async getTeamMembers() {
    const response = await api.get(API_ENDPOINTS.TEAM_MEMBERS);
    return response.data;
  }

  // Get user by ID
  async getUserById(id) {
    const response = await api.get(API_ENDPOINTS.USER_BY_ID(id));
    return response.data;
  }

  // Update user role (Admin only)
  async updateUserRole(id, role) {
    const response = await api.put(API_ENDPOINTS.UPDATE_USER_ROLE(id), { role });
    return response.data;
  }
}

export default new UserService();
