import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import projectService from '../../services/projectService';
import { Folder, Users, CheckSquare, Edit2, Trash2, MoreVertical } from 'lucide-react';
import { formatDate } from '../../utils/helpers';
import { USER_ROLES } from '../../utils/constants';
import toast from 'react-hot-toast';

const ProjectCard = ({ project }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const isOwner = project.owner?.id === user?.id;
  const isAdmin = user?.role === USER_ROLES.ADMIN;
  const canEdit = isOwner || isAdmin;

  // Delete Project Mutation
  const deleteMutation = useMutation({
    mutationFn: () => projectService.deleteProject(project.id),
    onSuccess: () => {
      queryClient.invalidateQueries(['projects']);
      queryClient.invalidateQueries(['dashboard']);
      toast.success('Project deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete project');
    },
  });

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this project? All associated tasks will be affected.')) {
      deleteMutation.mutate();
    }
  };

  const handleViewProject = () => {
    navigate(`/projects/${project.id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
            <Folder className="text-primary-600" size={24} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 
              className="text-lg font-semibold text-gray-900 truncate cursor-pointer hover:text-primary-600"
              onClick={handleViewProject}
            >
              {project.name}
            </h3>
            <p className="text-sm text-gray-500">
              Created by {project.owner.fullName}
            </p>
            {project.manager && (
              <p className="text-xs text-primary-600">
                👤 Manager: {project.manager.fullName}
              </p>
            )}
          </div>
        </div>

        {canEdit && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
            >
              <MoreVertical size={20} />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                <button
                  onClick={() => {
                    navigate(`/projects/${project.id}/edit`);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                >
                  <Edit2 size={16} />
                  Edit Project
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 size={16} />
                  Delete Project
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Description */}
      {project.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {project.description}
        </p>
      )}

      {/* Stats */}
      <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <Users size={16} />
          <span>{project.members?.length || 0} members</span>
        </div>
        <div className="flex items-center gap-1">
          <CheckSquare size={16} />
          <span>{project.taskCount || 0} tasks</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <span className="text-xs text-gray-500">
          Created {formatDate(project.createdAt)}
        </span>
        <button
          onClick={handleViewProject}
          className="text-sm font-medium text-primary-600 hover:text-primary-700 cursor-pointer"
        >
          View Details →
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;
