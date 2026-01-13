import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteTask, updateTask } from '../../store/slices/taskSlice';
import { Edit2, Trash2, Clock, Calendar, User, Flag } from 'lucide-react';
import Button from '../common/Button';
import TaskForm from './TaskForm';
import { 
  TASK_STATUS_COLORS, 
  TASK_STATUS_LABELS,
  TASK_PRIORITY_COLORS,
  TASK_PRIORITY_LABELS 
} from '../../utils/constants';
import { formatDateTime, formatDate } from '../../utils/helpers';

const TaskCard = ({ task }) => {
  const dispatch = useDispatch();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setIsDeleting(true);
      try {
        await dispatch(deleteTask(task.id)).unwrap();
      } catch (error) {
        setIsDeleting(false);
      }
    }
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    try {
      await dispatch(updateTask({
        id: task.id,
        taskData: { 
          title: task.title,
          description: task.description,
          status: newStatus,
          priority: task.priority,
          dueDate: task.dueDate,
          projectId: task.project?.id,
          assignedToId: task.assignedTo?.id,
        }
      })).unwrap();
    } catch (error) {
      // Error handled in slice
    }
  };

  const isPastDue = task.dueDate && new Date(task.dueDate) < new Date();

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {task.title}
            </h3>
            {task.project && (
              <p className="text-xs text-gray-500 mt-1">
                📁 {task.project.name}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 ml-2">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="text-gray-400 hover:text-primary-600 transition-colors"
              title="Edit task"
            >
              <Edit2 size={18} />
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
              title="Delete task"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {/* Priority Badge */}
        <div className="mb-3">
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${TASK_PRIORITY_COLORS[task.priority]}`}>
            <Flag size={12} />
            {TASK_PRIORITY_LABELS[task.priority]}
          </span>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Assigned To */}
        {task.assignedTo && (
          <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
            <User size={14} />
            <span>Assigned to {task.assignedTo.fullName}</span>
          </div>
        )}

        {/* Due Date */}
        {task.dueDate && (
          <div className={`flex items-center gap-2 mb-3 text-sm ${isPastDue ? 'text-red-600' : 'text-gray-600'}`}>
            <Calendar size={14} />
            <span>
              Due: {formatDate(task.dueDate)}
              {isPastDue && ' (Overdue)'}
            </span>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          {/* Status Dropdown */}
          <select
            value={task.status}
            onChange={handleStatusChange}
            className={`
              px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer
              focus:ring-2 focus:ring-primary-500 focus:outline-none
              ${TASK_STATUS_COLORS[task.status]}
            `}
          >
            <option value="TODO">{TASK_STATUS_LABELS.TODO}</option>
            <option value="IN_PROGRESS">{TASK_STATUS_LABELS.IN_PROGRESS}</option>
            <option value="COMPLETED">{TASK_STATUS_LABELS.COMPLETED}</option>
          </select>

          {/* Timestamp */}
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock size={12} />
            <span>{formatDateTime(task.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <TaskForm
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          task={task}
          mode="edit"
        />
      )}
    </>
  );
};

export default TaskCard;
