import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchTasks } from '../store/slices/taskSlice';
import { fetchProjects } from '../store/slices/projectSlice';
import Layout from '../components/layout/Layout';
import TaskFilters from '../components/tasks/TaskFilters';
import TaskList from '../components/tasks/TaskList';
import TaskForm from '../components/tasks/TaskForm';
import Button from '../components/common/Button';
import { Plus, FolderOpen, CheckSquare, Clock } from 'lucide-react';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { tasks } = useSelector((state) => state.tasks);
  const { projects } = useSelector((state) => state.projects);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchProjects());
  }, [dispatch]);

  // Calculate stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED').length;
  const pendingTasks = tasks.filter(t => t.status !== 'COMPLETED').length;
  const overdueTasks = tasks.filter(t => 
    t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'COMPLETED'
  ).length;

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.fullName?.split(' ')[0]}! 👋
        </h1>
        <p className="text-gray-600">
          Here's what you need to do today
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalTasks}</p>
            </div>
            <CheckSquare className="text-primary-600" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{completedTasks}</p>
            </div>
            <CheckSquare className="text-green-600" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{pendingTasks}</p>
            </div>
            <Clock className="text-blue-600" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{overdueTasks}</p>
            </div>
            <Clock className="text-red-600" size={32} />
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Link
          to="/projects"
          className="bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg p-6 hover:from-primary-600 hover:to-primary-700 transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">My Projects</h3>
              <p className="text-primary-100">
                {projects.length} active projects
              </p>
            </div>
            <FolderOpen size={48} className="opacity-80" />
          </div>
        </Link>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-6 hover:from-green-600 hover:to-green-700 transition-all text-left"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">Create Task</h3>
              <p className="text-green-100">
                Add a new task quickly
              </p>
            </div>
            <Plus size={48} className="opacity-80" />
          </div>
        </button>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <TaskFilters />
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="w-full sm:w-auto"
        >
          <Plus size={20} />
          New Task
        </Button>
      </div>

      {/* Task List */}
      <TaskList />

      {/* Create Task Modal */}
      <TaskForm
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        mode="create"
      />
    </Layout>
  );
};

export default DashboardPage;
