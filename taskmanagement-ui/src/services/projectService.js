import api from '../api/axios';
import { API_ENDPOINTS } from '../utils/constants';

class ProjectService {
  // Get all projects
  async getAllProjects() {
    const response = await api.get(API_ENDPOINTS.PROJECTS);
    return response.data;
  }

  // Get single project by ID
  async getProjectById(id) {
    const response = await api.get(API_ENDPOINTS.PROJECT_BY_ID(id));
    return response.data;
  }

  // Create new project
  async createProject(projectData) {
    const response = await api.post(API_ENDPOINTS.PROJECTS, projectData);
    return response.data;
  }

  // Update project
  async updateProject(id, projectData) {
    const response = await api.put(API_ENDPOINTS.PROJECT_BY_ID(id), projectData);
    return response.data;
  }

  // Delete project
  async deleteProject(id) {
    const response = await api.delete(API_ENDPOINTS.PROJECT_BY_ID(id));
    return response.data;
  }

  // Add member to project
  async addMember(projectId, userId) {
    const response = await api.post(API_ENDPOINTS.ADD_MEMBER(projectId, userId));
    return response.data;
  }

  // Remove member from project
  async removeMember(projectId, userId) {
    const response = await api.delete(API_ENDPOINTS.REMOVE_MEMBER(projectId, userId));
    return response.data;
  }
}

export default new ProjectService();
