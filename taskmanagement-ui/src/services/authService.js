import api from '../api/axios';
import { API_ENDPOINTS } from '../utils/constants';

class AuthService {
  // Login user
  async login(credentials) {
    const response = await api.post(API_ENDPOINTS.LOGIN, credentials);
    return response.data;
  }

  // Register user
  async register(userData) {
    const response = await api.post(API_ENDPOINTS.REGISTER, userData);
    return response.data;
  }

  // Logout user (clear local storage)
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Get current user from localStorage
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Get token from localStorage
  getToken() {
    return localStorage.getItem('token');
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getToken();
  }
}

export default new AuthService();