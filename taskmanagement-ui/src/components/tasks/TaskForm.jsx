import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createTask, updateTask } from '../../store/slices/taskSlice';
import { taskSchema } from '../../utils/validationSchemas';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { TASK_STATUS, TASK_STATUS_LABELS } from '../../utils/constants';

const TaskForm = ({ isOpen, onClose, task = null, mode = 'create' }) => {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      status: TASK_STATUS.TODO,
    },
  });

  // Populate form if editing
  useEffect(() => {
    if (task && mode === 'edit') {
      reset({
        title: task.title,
        description: task.description || '',
        status: task.status,
      });
    } else {
      reset({
        title: '',
        description: '',
        status: TASK_STATUS.TODO,
      });
    }
  }, [task, mode, reset]);

  const onSubmit = async (data) => {
    try {
      if (mode === 'create') {
        await dispatch(createTask(data)).unwrap();
      } else {
        await dispatch(updateTask({ id: task.id, taskData: data })).unwrap();
      }
      handleClose();
    } catch (error) {
      // Error handled in slice
      console.error(error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={mode === 'create' ? 'Create New Task' : 'Edit Task'}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            id="title"
            type="text"
            placeholder="Enter task title"
            {...register('title')}
            className={`
              w-full px-4 py-2 border rounded-lg outline-none
              focus:ring-2 focus:ring-primary-500 focus:border-primary-500
              ${errors.title ? 'border-red-500' : 'border-gray-300'}
            `}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            rows="4"
            placeholder="Enter task description (optional)"
            {...register('description')}
            className={`
              w-full px-4 py-2 border rounded-lg resize-none outline-none
              focus:ring-2 focus:ring-primary-500 focus:border-primary-500
              ${errors.description ? 'border-red-500' : 'border-gray-300'}
            `}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            {...register('status')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value={TASK_STATUS.TODO}>{TASK_STATUS_LABELS.TODO}</option>
            <option value={TASK_STATUS.IN_PROGRESS}>{TASK_STATUS_LABELS.IN_PROGRESS}</option>
            <option value={TASK_STATUS.COMPLETED}>{TASK_STATUS_LABELS.COMPLETED}</option>
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
            loading={isSubmitting}
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
