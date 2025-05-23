import { useState, useEffect } from 'react';
import taskService from '../api/tasks';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import { useAuth } from '../hooks/useAuth';
import { FaRegPlusSquare } from "react-icons/fa";

const TaskList = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksData, usersData] = await Promise.all([
          taskService.getTasks(),
          user.role === 'admin' ? taskService.getUsers() : Promise.resolve([])
        ]);
        setTasks(tasksData);
        setUsers(usersData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.role]);

  const activeTaskCount = tasks.filter(task => 
    user.role === 'admin' 
      ? task.status !== 'done' 
      : task.assignedTo === user.username && task.status !== 'done'
  ).length;

  const filteredTasks = user.role === 'admin' 
    ? tasks 
    : tasks.filter(task => task.assignedTo === user.username);

  const handleCreate = () => {
    setCurrentTask(null);
    setShowForm(true);
  };

  const handleEdit = (task) => {
    setCurrentTask(task);
    setShowForm(true);
  };

  const handleDelete = async (taskId) => {
    try {
      await taskService.deleteTask(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const refreshTasks = async () => {
    try {
      const updatedTasks = await taskService.getTasks();
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Refresh failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="px-[40px] sm:px-[80px] lg:px-[100px]">
      <div className="mb-6">
        <h2 className="text-[28px] font-bold text-gray-900">
          Welcome, <span className="text-blue-600">{user?.username}</span>.
        </h2>
        
        {user.role === "admin" ? (
          <p className="text-[18px] font-[600] text-[#8D9CB8]">
            Your team has {activeTaskCount} {activeTaskCount === 1 ? 'task' : 'tasks'} to do.
          </p>
        ) : (
          <p className="text-[18px] font-[600] text-[#8D9CB8]">
            You've got {activeTaskCount} {activeTaskCount === 1 ? 'task' : 'tasks'} to do.
          </p>
        )}
      </div>

      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 bg-white shadow rounded-md">
            <p className="text-gray-500">No tasks found</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusChange={refreshTasks}
            />
          ))
        )}
      </div>

      {user.role === "admin" && (
        <button
          onClick={handleCreate}
          className="mt-6 w-full flex items-center justify-start space-x-2 text-gray-500 text-sm py-2 px-3 hover:bg-gray-50"
        >
          <FaRegPlusSquare className='text-[#8D9CB8] text-xl leading-none'/>
          <span className='text-[#8D9CB8] text-[18px] font-[600]'>Add a new task...</span>
        </button>
      )}

      {showForm && (
        <TaskForm
          task={currentTask}
          onClose={() => setShowForm(false)}
          onTaskUpdated={refreshTasks}
          users={users}
        />
      )}
    </div>
  );
};

export default TaskList;