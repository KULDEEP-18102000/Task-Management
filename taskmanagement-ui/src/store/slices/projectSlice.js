import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import projectService from '../../services/projectService';
import toast from 'react-hot-toast';
import { handleApiError } from '../../utils/helpers';

// Async thunks
export const fetchProjects = createAsyncThunk(
  'projects/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const data = await projectService.getAllProjects();
      return data;
    } catch (error) {
      const message = handleApiError(error);
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const fetchProjectById = createAsyncThunk(
  'projects/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await projectService.getProjectById(id);
      return data;
    } catch (error) {
      const message = handleApiError(error);
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const createProject = createAsyncThunk(
  'projects/create',
  async (projectData, { rejectWithValue }) => {
    try {
      const data = await projectService.createProject(projectData);
      toast.success('Project created successfully!');
      return data;
    } catch (error) {
      const message = handleApiError(error);
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const updateProject = createAsyncThunk(
  'projects/update',
  async ({ id, projectData }, { rejectWithValue }) => {
    try {
      const data = await projectService.updateProject(id, projectData);
      toast.success('Project updated successfully!');
      return data;
    } catch (error) {
      const message = handleApiError(error);
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const deleteProject = createAsyncThunk(
  'projects/delete',
  async (id, { rejectWithValue }) => {
    try {
      await projectService.deleteProject(id);
      toast.success('Project deleted successfully!');
      return id;
    } catch (error) {
      const message = handleApiError(error);
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const addMember = createAsyncThunk(
  'projects/addMember',
  async ({ projectId, userId }, { rejectWithValue }) => {
    try {
      const data = await projectService.addMember(projectId, userId);
      toast.success('Member added successfully!');
      return data;
    } catch (error) {
      const message = handleApiError(error);
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const removeMember = createAsyncThunk(
  'projects/removeMember',
  async ({ projectId, userId }, { rejectWithValue }) => {
    try {
      const data = await projectService.removeMember(projectId, userId);
      toast.success('Member removed successfully!');
      return data;
    } catch (error) {
      const message = handleApiError(error);
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  projects: [],
  currentProject: null,
  loading: false,
  error: null,
};

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setCurrentProject: (state, action) => {
      state.currentProject = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all projects
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch project by ID
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProject = action.payload;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create project
      .addCase(createProject.fulfilled, (state, action) => {
        state.projects.unshift(action.payload);
      })
      // Update project
      .addCase(updateProject.fulfilled, (state, action) => {
        const index = state.projects.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
        if (state.currentProject?.id === action.payload.id) {
          state.currentProject = action.payload;
        }
      })
      // Delete project
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter(p => p.id !== action.payload);
        if (state.currentProject?.id === action.payload) {
          state.currentProject = null;
        }
      })
      // Add/Remove member
      .addCase(addMember.fulfilled, (state, action) => {
        const index = state.projects.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
        if (state.currentProject?.id === action.payload.id) {
          state.currentProject = action.payload;
        }
      })
      .addCase(removeMember.fulfilled, (state, action) => {
        const index = state.projects.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
        if (state.currentProject?.id === action.payload.id) {
          state.currentProject = action.payload;
        }
      });
  },
});

export const { setCurrentProject, clearError } = projectSlice.actions;
export default projectSlice.reducer;
