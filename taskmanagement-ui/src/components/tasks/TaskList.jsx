import React from 'react';
import { useSelector } from 'react-redux';
import { selectFilteredTasks } from '../../store/slices/taskSlice';
import TaskCard from './TaskCard';
import Loader from '../common/Loader';
import { Inbox } from 'lucide-react';

const TaskList = () => {
  const filteredTasks = useSelector(selectFilteredTasks);
  const { loading, filter } = useSelector((state) => state.tasks);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader size="lg" />
      </div>
    );
  }

  if (filteredTasks.length === 0) {
    return (
      <div className="text-center py-12">
        <Inbox className="mx-auto text-gray-400 mb-4" size={64} />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No tasks found
        </h3>
        <p className="text-gray-600">
          {filter === 'ALL'
            ? 'Create your first task to get started!'
            : `No tasks with status "${filter}"`}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredTasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
};

export default TaskList;
