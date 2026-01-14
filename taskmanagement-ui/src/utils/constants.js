export const TASK_STATUS = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
};

export const TASK_STATUS_LABELS = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
};

export const TASK_STATUS_COLORS = {
  TODO: 'bg-gray-100 text-gray-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
};

export const TASK_PRIORITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
};

export const TASK_PRIORITY_LABELS = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  CRITICAL: 'Critical',
};

export const TASK_PRIORITY_COLORS = {
  LOW: 'bg-gray-100 text-gray-600',
  MEDIUM: 'bg-blue-100 text-blue-600',
  HIGH: 'bg-orange-100 text-orange-600',
  CRITICAL: 'bg-red-100 text-red-600',
};

export const USER_ROLES = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  USER: 'USER',
};

export const USER_ROLE_LABELS = {
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  USER: 'User',
};

// Activity Types
export const ACTIVITY_TYPES = {
  TASK_CREATED: 'TASK_CREATED',
  TASK_UPDATED: 'TASK_UPDATED',
  TASK_DELETED: 'TASK_DELETED',
  TASK_ASSIGNED: 'TASK_ASSIGNED',
  TASK_COMPLETED: 'TASK_COMPLETED',
  COMMENT_ADDED: 'COMMENT_ADDED',
  PROJECT_CREATED: 'PROJECT_CREATED',
  PROJECT_UPDATED: 'PROJECT_UPDATED',
  MEMBER_ADDED: 'MEMBER_ADDED',
  MEMBER_REMOVED: 'MEMBER_REMOVED',
};

// Notification Types
export const NOTIFICATION_TYPES = {
  TASK_ASSIGNED: 'TASK_ASSIGNED',
  TASK_UPDATED: 'TASK_UPDATED',
  COMMENT_ADDED: 'COMMENT_ADDED',
  PROJECT_INVITE: 'PROJECT_INVITE',
  TASK_DUE_SOON: 'TASK_DUE_SOON',
  TASK_OVERDUE: 'TASK_OVERDUE',
  MENTION: 'MENTION',
};

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  
  // Tasks
  TASKS: '/tasks',
  TASK_BY_ID: (id) => `/tasks/${id}`,
  TASKS_BY_PROJECT: (projectId) => `/tasks/project/${projectId}`,
  
  // Projects
  PROJECTS: '/projects',
  PROJECT_BY_ID: (id) => `/projects/${id}`,
  ADD_MEMBER: (projectId, userId) => `/projects/${projectId}/members/${userId}`,
  REMOVE_MEMBER: (projectId, userId) => `/projects/${projectId}/members/${userId}`,
  
  // Users
  USERS: '/users',
  USER_BY_ID: (id) => `/users/${id}`,
  TEAM_MEMBERS: '/users/team-members',
  UPDATE_USER_ROLE: (id) => `/users/${id}/role`,
  
  // Comments (NEW)
  TASK_COMMENTS: (taskId) => `/tasks/${taskId}/comments`,
  DELETE_COMMENT: (taskId, commentId) => `/tasks/${taskId}/comments/${commentId}`,
  
  // Activities (NEW)
  RECENT_ACTIVITIES: '/activities/recent',
  TASK_ACTIVITIES: (taskId) => `/activities/task/${taskId}`,
  PROJECT_ACTIVITIES: (projectId) => `/activities/project/${projectId}`,
  USER_ACTIVITIES: '/activities/user',
  
  // Notifications (NEW)
  NOTIFICATIONS: '/notifications',
  UNREAD_NOTIFICATIONS: '/notifications/unread',
  UNREAD_COUNT: '/notifications/unread/count',
  MARK_READ: (id) => `/notifications/${id}/read`,
  MARK_ALL_READ: '/notifications/read-all',
};

// WebSocket Configuration
export const WS_BASE_URL = 'http://localhost:8080';
export const WS_ENDPOINT = '/ws';