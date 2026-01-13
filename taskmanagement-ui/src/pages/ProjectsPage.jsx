import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects } from '../store/slices/projectSlice';
import Layout from '../components/layout/Layout';
import ProjectList from '../components/projects/ProjectList';
import ProjectForm from '../components/projects/ProjectForm';
import Button from '../components/common/Button';
import { Plus } from 'lucide-react';
import { USER_ROLES } from '../utils/constants';

const ProjectsPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const canCreateProject = user?.role === USER_ROLES.ADMIN || user?.role === USER_ROLES.MANAGER;

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Projects
        </h1>
        <p className="text-gray-600">
          Organize your tasks into projects and collaborate with your team
        </p>
      </div>

      {/* Actions Bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-gray-600">
          {/* Stats or filters can go here */}
        </div>
        
        {canCreateProject && (
          <Button
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus size={20} />
            New Project
          </Button>
        )}
      </div>

      {/* Project List */}
      <ProjectList />

      {/* Create Project Modal */}
      {canCreateProject && (
        <ProjectForm
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          mode="create"
        />
      )}
    </Layout>
  );
};

export default ProjectsPage;
