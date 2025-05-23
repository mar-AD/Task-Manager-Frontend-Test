import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import taskService from '../api/tasks';
import { useAuth } from '../hooks/useAuth';
import { FiEdit3 , FiCheck  } from 'react-icons/fi';
import { FaRegCheckCircle } from "react-icons/fa";
import { HiOutlineTrash } from "react-icons/hi2";

const TaskItem = ({ task, onEdit, onDelete, onStatusChange }) => {
  const { user } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [localTask, setLocalTask] = useState(null);

  useEffect(() => {
    if (task) {
      setLocalTask(task);
    }
  }, [task]);

  const handleStatusChange = async () => {
    if (!task?.id) {
      return;
    }

    try {
      setIsUpdating(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Missing auth token');

      const newStatus = 'done';
      const response = await taskService.updateTask(task.id, { status: newStatus }, token);
      onStatusChange(task.id, newStatus);
      toast.success('Task marked as Done');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  if (!localTask) {
    return <div className="bg-[#f5f7f9] rounded-2xl px-4 py-2 shadow-sm animate-pulse h-20" />;
  }

  const canEdit = user?.role === 'admin' || localTask.assignedTo?.id === user?.id;
  const isAdmin = user?.role === 'admin';
  const isDone = localTask.status === 'done';

  return (
    <div className="bg-[#f5f7f9] rounded-2xl px-4 py-2 shadow-sm group">
      <div className="h-full flex justify-between items-center">
        <div className="flex items-start space-x-3">
          {isDone && <FiCheck className="text-blue-600 w-5 h-5 m-auto" title="Task Done" />}
          <div>
            {isAdmin && localTask.assignedTo && (
              <p className="text-[13px] font-[400] text-blue-600">
                {typeof localTask.assignedTo === 'object' 
                  ? localTask.assignedTo.username 
                  : localTask.assignedTo}
              </p>
            )}
            <h3 className={`text-[18px] font-[600] text-gray-800 ${isDone ? 'line-through' : ''}`}>
              {localTask.title}
            </h3>
            <p className={`text-sm font-[400] text-[#8D9CB8] truncate max-w-[300px] ${isDone ? 'line-through' : ''}`}>
              {localTask.description}
            </p>
          </div>
        </div>
        <div className="hidden group-hover:flex rounded-xl items-center my-auto space-x-3">
          {renderActionButtons()}
        </div>
      </div>
    </div>
  );

  function renderActionButtons() {
    if (isDone) {
      return isAdmin && (
        <button
          onClick={() => onDelete(localTask.id)}
          title="Delete"
          className="text-red-500 hover:text-red-700"
        >
          <HiOutlineTrash className="w-5 h-5" />
        </button>
      );
    }

    return (
      <>
        {canEdit && (
          <button
            onClick={() => onEdit(localTask)}
            title="Edit"
            className="text-gray-500 text-[18px] font-[600] hover:text-indigo-600"
          >
            <FiEdit3 className="w-5 h-5" />
          </button>
        )}
        {isAdmin && (
          <button
            onClick={() => onDelete(localTask.id)}
            title="Delete"
            className="text-red-500 hover:text-red-700"
          >
            <HiOutlineTrash className="w-5 h-5" />
          </button>
        )}
        {canEdit && (
          <button
            onClick={handleStatusChange}
            disabled={isUpdating}
            title="Mark as Done"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm font-medium flex items-center space-x-1"
          >
            <FaRegCheckCircle className="w-4 h-4" />
            <span>Done</span>
          </button>
        )}
      </>
    );
  }
};

export default TaskItem;
