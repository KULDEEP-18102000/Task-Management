import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTask, updateTask } from '../../store/slices/taskSlice';
import projectService from '../../services/projectService';
import userService from '../../services/userService';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { TASK_STATUS, TASK_STATUS_LABELS, TASK_PRIORITY, TASK_PRIORITY_LABELS } from '../../utils/constants';

const TaskForm = ({ isOpen, onClose, task = null, mode = 'create', projectId = null }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: TASK_STATUS.TODO,
    priority: TASK_PRIORITY.MEDIUM,
    dueDate: '',
    projectId: projectId || '',
    assignedToId: '',
  });

  const [errors, setErrors] = useState({});

  // Fetch projects and team members
  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      try {
        const [projectsData, membersData] = await Promise.all([
          projectService.getAllProjects(),
          userService.getTeamMembers(),
        ]);
        setProjects(projectsData);
        setTeamMembers(membersData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoadingData(false);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  // Populate form if editing
  useEffect(() => {
    if (task && mode === 'edit') {
      setFormData({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority || TASK_PRIORITY.MEDIUM,
        dueDate: task.dueDate || '',
        projectId: task.project?.id || '',
        assignedToId: task.assignedTo?.id || '',
      });
    }
  }, [task, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must not exceed 100 characters';
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

    setLoading(true);
    
    // Prepare task data
    const taskData = {
      title: formData.title,
      description: formData.description,
      status: formData.status,
      priority: formData.priority,
      dueDate: formData.dueDate || null,
      projectId: formData.projectId ? parseInt(formData.projectId) : null,
      assignedToId: formData.assignedToId ? parseInt(formData.assignedToId) : null,
    };

    try {
      if (mode === 'create') {
        await dispatch(createTask(taskData)).unwrap();
      } else {
        await dispatch(updateTask({ id: task.id, taskData })).unwrap();
      }
      handleClose();
    } catch (error) {
      // Error handled in slice
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      status: TASK_STATUS.TODO,
      priority: TASK_PRIORITY.MEDIUM,
      dueDate: '',
      projectId: projectId || '',
      assignedToId: '',
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={mode === 'create' ? 'Create New Task' : 'Edit Task'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          error={errors.title}
          placeholder="Enter task title"
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
            placeholder="Enter task description (optional)"
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {Object.entries(TASK_STATUS_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {Object.entries(TASK_PRIORITY_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        <Input
          label="Due Date"
          name="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={handleChange}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Project (Optional)
          </label>
          <select
            name="projectId"
            value={formData.projectId}
            onChange={handleChange}
            disabled={loadingData}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
          >
            <option value="">No Project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Assign To (Optional)
          </label>
          <select
            name="assignedToId"
            value={formData.assignedToId}
            onChange={handleChange}
            disabled={loadingData}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
          >
            <option value="">Assign to me</option>
            {teamMembers.map((member) => (
              <option key={member.id} value={member.id}>
                {member.fullName} ({member.role})
              </option>
            ))}
          </select>
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
            loading={loading}
            fullWidth
          >
            {mode === 'create' ? 'Create Task' : 'Update Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskForm;
