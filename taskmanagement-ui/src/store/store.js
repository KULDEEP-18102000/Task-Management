import { configureStore } from '@reduxjs/toolkit';
import taskReducer from './slices/taskSlice';
import projectReducer from './slices/projectSlice';
import notificationReducer from './slices/notificationSlice';  // NEW

export const store = configureStore({
  reducer: {
    tasks: taskReducer,
    projects: projectReducer,
    notifications: notificationReducer,  // NEW
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});