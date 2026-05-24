import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import projectService from '../../services/projectService';
import userService from '../../services/userService';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import toast from 'react-hot-toast';

const ProjectForm = ({ isOpen, onClose, project = null, mode = 'create' }) => {
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    managerId: '',
    memberIds: [],
  });

  const [errors, setErrors] = useState({});

  // Fetch team members using useQuery
  const { data: teamMembers = [], isLoading: loadingMembers } = useQuery({
    queryKey: ['users', 'team-members'],
    queryFn: () => userService.getTeamMembers(),
    enabled: isOpen,
  });

  // Create Project Mutation
  const createMutation = useMutation({
    mutationFn: (projectData) => projectService.createProject(projectData),
    onSuccess: () => {
      queryClient.invalidateQueries(['projects']);
      toast.success('Project created successfully!');
      handleClose();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create project');
    },
  });

  // Update Project Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, projectData }) => projectService.updateProject(id, projectData),
    onSuccess: () => {
      queryClient.invalidateQueries(['projects']);
      queryClient.invalidateQueries(['projects', project?.id.toString()]);
      toast.success('Project updated successfully!');
      handleClose();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update project');
    },
  });

  // Populate form if editing
  useEffect(() => {
    if (isOpen && project && mode === 'edit') {
      setFormData({
        name: project.name,
        description: project.description || '',
        managerId: project.manager?.id || '',
        memberIds: project.members?.map(m => m.id) || [],
      });
    } else if (isOpen && mode === 'create') {
      setFormData({
        name: '',
        description: '',
        managerId: '',
        memberIds: [],
      });
    }
  }, [isOpen, project, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleMemberToggle = (memberId) => {
    setFormData((prev) => ({
      ...prev,
      memberIds: prev.memberIds.includes(memberId)
        ? prev.memberIds.filter(id => id !== memberId)
        : [...prev.memberIds, memberId],
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Project name must not exceed 100 characters';
    }

    if (formData.description && formData.description.length > 1000) {
      newErrors.description = 'Description must not exceed 1000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;
    
    const projectData = {
      ...formData,
      managerId: formData.managerId ? parseInt(formData.managerId) : null,
    };
    
    if (mode === 'create') {
      createMutation.mutate(projectData);
    } else {
      updateMutation.mutate({ id: project.id, projectData });
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      managerId: '',
      memberIds: [],
    });
    setErrors({});
    onClose();
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={mode === 'create' ? 'Create New Project' : 'Edit Project'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Project Name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          placeholder="Enter project name"
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            placeholder="Enter project description (optional)"
            className={`
              w-full px-4 py-2 border rounded-lg resize-none
              focus:ring-2 focus:ring-primary-500 focus:border-transparent
              ${errors.description ? 'border-red-500' : 'border-gray-300'}
            `}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        {/* Project Manager Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Project Manager (Optional)
          </label>
          <select
            name="managerId"
            value={formData.managerId}
            onChange={handleChange}
            disabled={loadingMembers}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
          >
            <option value="">Assign to me</option>
            {teamMembers
              .filter(member => member.role === 'ADMIN' || member.role === 'MANAGER')
              .map((member) => (
                <option key={member.id} value={member.id}>
                  {member.fullName} ({member.role})
                </option>
              ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">
            Only Admins and Managers can be assigned as project managers
          </p>
        </div>

        {/* Team Members Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Team Members (Optional)
          </label>
          
          {loadingMembers ? (
            <div className="text-sm text-gray-500">Loading team members...</div>
          ) : (
            <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-2 space-y-2">
              {teamMembers.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-2">
                  No team members available
                </p>
              ) : (
                teamMembers.map((member) => (
                  <label
                    key={member.id}
                    className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.memberIds.includes(member.id)}
                      onChange={() => handleMemberToggle(member.id)}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {member.fullName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {member.email} • {member.role}
                      </p>
                    </div>
                  </label>
                ))
              )}
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            fullWidth
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={isPending}
            fullWidth
          >
            {mode === 'create' ? 'Create Project' : 'Update Project'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProjectForm;
