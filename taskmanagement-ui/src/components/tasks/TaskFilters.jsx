import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter } from '../../store/slices/taskSlice';
import { TASK_STATUS, TASK_STATUS_LABELS } from '../../utils/constants';

const TaskFilters = () => {
  const dispatch = useDispatch();
  const { filter, tasks } = useSelector((state) => state.tasks);

  const getCount = (status) => {
    if (status === 'ALL') return tasks.length;
    return tasks.filter((task) => task.status === status).length;
  };

  const filters = [
    { value: 'ALL', label: 'All Tasks', count: getCount('ALL') },
    { value: TASK_STATUS.TODO, label: TASK_STATUS_LABELS.TODO, count: getCount(TASK_STATUS.TODO) },
    { value: TASK_STATUS.IN_PROGRESS, label: TASK_STATUS_LABELS.IN_PROGRESS, count: getCount(TASK_STATUS.IN_PROGRESS) },
    { value: TASK_STATUS.COMPLETED, label: TASK_STATUS_LABELS.COMPLETED, count: getCount(TASK_STATUS.COMPLETED) },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((item) => (
        <button
          key={item.value}
          onClick={() => dispatch(setFilter(item.value))}
          className={`
            px-4 py-2 rounded-lg font-medium transition-colors
            ${filter === item.value
              ? 'bg-primary-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }
          `}
        >
          {item.label}
          <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-white bg-opacity-20">
            {item.count}
          </span>
        </button>
      ))}
    </div>
  );
};

export default TaskFilters;
