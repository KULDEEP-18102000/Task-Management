import React from 'react';
import { useSelector } from 'react-redux';
import ProjectCard from './ProjectCard';
import Loader from '../common/Loader';
import { FolderOpen } from 'lucide-react';

const ProjectList = () => {
  const { projects, loading } = useSelector((state) => state.projects);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader size="lg" />
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <FolderOpen className="mx-auto text-gray-400 mb-4" size={64} />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No projects yet
        </h3>
        <p className="text-gray-600">
          Create your first project to organize your tasks!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
};

export default ProjectList;
