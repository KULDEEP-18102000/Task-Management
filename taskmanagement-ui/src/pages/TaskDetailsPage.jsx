import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Flag, User, Edit2, Trash2 } from 'lucide-react';
import Layout from '../components/layout/Layout';
import CommentList from '../components/comments/CommentList';
import ActivityFeed from '../components/activities/ActivityFeed';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import taskService from '../services/taskService';
import { 
  TASK_STATUS_LABELS, 
  TASK_STATUS_COLORS,
  TASK_PRIORITY_LABELS,
  TASK_PRIORITY_COLORS 
} from '../utils/constants';
import { formatDate } from '../utils/helpers';

const TaskDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTask();
  }, [id]);

  const fetchTask = async () => {
    setLoading(true);
    try {
      const data = await taskService.getTaskById(id);
      setTask(data);
    } catch (error) {
      console.error('Failed to fetch task:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <Loader fullScreen />
      </Layout>
    );
  }

  if (!task) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Task not found
          </h3>
          <Button onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={20} />
            Back to Dashboard
          </Button>
        </div>
      </Layout>
    );
  }

  const isPastDue = task.dueDate && new Date(task.dueDate) < new Date();

  return (
    <Layout>
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft size={20} />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Task Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {task.title}
                </h1>
                
                {task.project && (
                  <p className="text-sm text-gray-500">
                    📁 {task.project.name}
                  </p>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Edit2 size={16} />
                  Edit
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 size={16} />
                  Delete
                </Button>
              </div>
            </div>

            {/* Status and Priority */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${TASK_STATUS_COLORS[task.status]}`}>
                {TASK_STATUS_LABELS[task.status]}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${TASK_PRIORITY_COLORS[task.priority]}`}>
                <Flag size={14} className="inline mr-1" />
                {TASK_PRIORITY_LABELS[task.priority]}
              </span>
            </div>

            {/* Description */}
            {task.description && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {task.description}
                </p>
              </div>
            )}

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              {task.assignedTo && (
                <div className="flex items-center gap-2 text-sm">
                  <User size={16} className="text-gray-400" />
                  <div>
                    <p className="text-gray-500">Assigned to</p>
                    <p className="font-medium text-gray-900">{task.assignedTo.fullName}</p>
                  </div>
                </div>
              )}
              
              {task.dueDate && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={16} className="text-gray-400" />
                  <div>
                    <p className="text-gray-500">Due date</p>
                    <p className={`font-medium ${isPastDue ? 'text-red-600' : 'text-gray-900'}`}>
                      {formatDate(task.dueDate)}
                      {isPastDue && ' (Overdue)'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Comments
            </h2>
            <CommentList taskId={parseInt(id)} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Activity Feed */}
          <ActivityFeed type="task" taskId={parseInt(id)} limit={10} />
        </div>
      </div>
    </Layout>
  );
};

export default TaskDetailsPage;
