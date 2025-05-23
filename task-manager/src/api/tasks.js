import api from './axiosConfig';
import { toast } from 'react-toastify';

const validateTaskData = (data) => {
  if (Array.isArray(data)) {
    return data;
  }
  if (data && typeof data === 'object' && data.id) {
    return data;
  }
  throw new Error('Invalid task data format');
};

const getTasks = async () => {
  const response = await api.get('/tasks');
  return validateTaskData(response.data);
};

const createTask = async (taskData) => {
  const response = await api.post('/tasks', taskData);
  return validateTaskData(response.data);
};

const updateTask = async (id, taskData) => {
  const response = await api.put(`/tasks/${id}`, taskData);
  return validateTaskData(response.data);
};

const deleteTask = async (id) => {
  await api.delete(`/tasks/${id}`);
  toast.success('Task deleted successfully!');
  return id;
};

const getUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

export default {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getUsers
};