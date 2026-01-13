import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjectById } from '../store/slices/projectSlice';
import { fetchTasks } from '../store/slices/taskSlice';
import taskService from '../services/taskService';
import Layout from '../components/layout/Layout';
import TaskCard from '../components/tasks/TaskCard';
import TaskForm from '../components/tasks/TaskForm';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import { Plus, ArrowLeft, Users, CheckSquare, Edit2 } from 'lucide-react';
import { USER_ROLES } from '../utils/constants';
import ProjectForm from '../components/projects/ProjectForm';

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { currentProject, loading } = useSelector((state) => state.projects);
  const { tasks } = useSelector((state) => state.tasks);
  
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);
  const [projectTasks, setProjectTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);

  const isOwner = currentProject?.owner.id === user?.id;
  const isAdmin = user?.role === USER_ROLES.ADMIN;
  const canEdit = isOwner || isAdmin;

  useEffect(() => {
    dispatch(fetchProjectById(id));
  }, [dispatch, id]);

  useEffect(() => {
    const fetchProjectTasks = async () => {
      setLoadingTasks(true);
      try {
        const data = await taskService.getTasksByProject(id);
        setProjectTasks(data);
      } catch (error) {
        console.error('Failed to fetch project tasks:', error);
      } finally {
        setLoadingTasks(false);
      }
    };

    if (id) {
      fetchProjectTasks();
    }
  }, [id, tasks]);

  if (loading) {
    return (
      <Layout>
        <Loader fullScreen />
      </Layout>
    );
  }

  if (!currentProject) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Project not found
          </h3>
          <Button onClick={() => navigate('/projects')}>
            <ArrowLeft size={20} />
            Back to Projects
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Back Button */}
      <button
        onClick={() => navigate('/projects')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft size={20} />
        Back to Projects
      </button>

      {/* Project Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {currentProject.name}
            </h1>
            {currentProject.description && (
              <p className="text-gray-600">
                {currentProject.description}
              </p>
            )}
          </div>
          
          {canEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditProjectOpen(true)}
            >
              <Edit2 size={16} />
              Edit Project
            </Button>
          )}
        </div>

        {/* Project Stats */}
        <div className="flex items-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Users size={18} />
            <span>{currentProject.members?.length || 0} members</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckSquare size={18} />
            <span>{projectTasks.length} tasks</span>
          </div>
        </div>

        {/* Project Owner */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Owned by <span className="font-medium text-gray-900">{currentProject.owner.fullName}</span>
          </p>
        </div>

        {/* Team Members */}
        {currentProject.members && currentProject.members.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Team Members:</h3>
            <div className="flex flex-wrap gap-2">
              {currentProject.members.map((member) => (
                <span
                  key={member.id}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700"
                >
                  {member.fullName}
                  <span className="ml-1 text-xs text-gray-500">({member.role})</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tasks Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
          <Button onClick={() => setIsCreateTaskOpen(true)}>
            <Plus size={20} />
            New Task
          </Button>
        </div>

        {loadingTasks ? (
          <div className="flex justify-center py-12">
            <Loader size="lg" />
          </div>
        ) : projectTasks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <CheckSquare className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No tasks yet
            </h3>
            <p className="text-gray-600 mb-4">
              Create your first task to get started!
            </p>
            <Button onClick={() => setIsCreateTaskOpen(true)}>
              <Plus size={20} />
              Create Task
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projectTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>

      {/* Create Task Modal */}
      <TaskForm
        isOpen={isCreateTaskOpen}
        onClose={() => setIsCreateTaskOpen(false)}
        mode="create"
        projectId={parseInt(id)}
      />

      {/* Edit Project Modal */}
      {canEdit && (
        <ProjectForm
          isOpen={isEditProjectOpen}
          onClose={() => setIsEditProjectOpen(false)}
          project={currentProject}
          mode="edit"
        />
      )}
    </Layout>
  );
};

export default ProjectDetailsPage;
