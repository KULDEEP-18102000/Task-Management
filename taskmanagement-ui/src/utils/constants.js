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

// NEW: Task Priority
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

// NEW: User Roles
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

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  
  // Tasks
  TASKS: '/tasks',
  TASK_BY_ID: (id) => `/tasks/${id}`,
  TASKS_BY_PROJECT: (projectId) => `/tasks/project/${projectId}`,
  
  // Projects (NEW)
  PROJECTS: '/projects',
  PROJECT_BY_ID: (id) => `/projects/${id}`,
  ADD_MEMBER: (projectId, userId) => `/projects/${projectId}/members/${userId}`,
  REMOVE_MEMBER: (projectId, userId) => `/projects/${projectId}/members/${userId}`,
  
  // Users (NEW)
  USERS: '/users',
  USER_BY_ID: (id) => `/users/${id}`,
  TEAM_MEMBERS: '/users/team-members',
  UPDATE_USER_ROLE: (id) => `/users/${id}/role`,
};