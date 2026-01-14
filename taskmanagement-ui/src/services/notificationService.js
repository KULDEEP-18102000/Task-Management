import api from '../api/axios';
import { API_ENDPOINTS } from '../utils/constants';

class NotificationService {
  // Get all notifications
  async getAllNotifications() {
    const response = await api.get(API_ENDPOINTS.NOTIFICATIONS);
    return response.data;
  }

  // Get unread notifications
  async getUnreadNotifications() {
    const response = await api.get(API_ENDPOINTS.UNREAD_NOTIFICATIONS);
    return response.data;
  }

  // Get unread count
  async getUnreadCount() {
    const response = await api.get(API_ENDPOINTS.UNREAD_COUNT);
    return response.data.count;
  }

  // Mark notification as read
  async markAsRead(notificationId) {
    const response = await api.put(API_ENDPOINTS.MARK_READ(notificationId));
    return response.data;
  }

  // Mark all as read
  async markAllAsRead() {
    const response = await api.put(API_ENDPOINTS.MARK_ALL_READ);
    return response.data;
  }
}

export default new NotificationService();
