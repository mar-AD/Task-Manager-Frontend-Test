import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import taskService from '../api/tasks';
import { useAuth } from '../hooks/useAuth';

const TaskForm = ({ task = null, onClose, onTaskUpdated }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: user.role === 'admin' ? '' : user.id
  });
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      if (user.role === 'admin') {
        setLoadingUsers(true);
        try {
          const users = await taskService.getUsers();
          setUsers(users);
        } catch (error) {
          toast.error('Failed to load users');
        } finally {
          setLoadingUsers(false);
        }
      }
    };

    fetchUsers();
  }, [user.role]);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        assignedTo: task.assignedTo || (user.role === 'admin' ? '' : user.id)
      });
    } else {
      setFormData({
        title: '',
        description: '',
        assignedTo: user.role === 'admin' ? '' : user.id
      });
    }
  }, [task, user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (task) {
        await taskService.updateTask(task.id, formData);
        toast.success('Task updated successfully');
      } else {
        await taskService.createTask(formData);
        toast.success('Task created successfully');
      }
      onTaskUpdated();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={handleOverlayClick} >
      <div className="bg-white rounded-[20px] shadow-xl max-w-2xl w-full p-[20px]">

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col space-y-4">
          <div className="flex flex-row space-x-4">
              <div className={user.role === 'admin' ? "w-2/3" : "w-full"}>
                <label htmlFor="title" className="block text-lg font-semibold">
                  Task title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  placeholder='Whats in your mind?'
                  required
                  className="rounded-[15px] mt-1 block w-full h-[48px] appearance-none border-none bg-[#F5F7F9] shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              {user.role === 'admin' && (
                <div className="w-1/3">
                  <label htmlFor="assignedTo" className="block text-lg font-semibold">
                    Assign to
                  </label>
                  {loadingUsers ? (
                    <p className="mt-1 text-sm text-gray-500">Loading users...</p>
                  ) : (
                    <select
                      name="assignedTo"
                      id="assignedTo"
                      className="mt-1 block w-full h-[48px] rounded-[15px] appearance-none border-none bg-[#F5F7F9] shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={formData.assignedTo}
                      onChange={handleChange}
                      required
                    >
                      {!task && <option value="">user</option>}
                      {users.map(user => (
                        <option key={user.id} value={user.id}>
                          {user.username}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-lg font-semibold ">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                placeholder='Description'
                rows={3}
                className="mt-1 block w-full appearance-none border-none bg-[#F5F7F9] rounded-[15px] shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-[128px]"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border-none text-[#FF5E5E] rounded-[15px] bg-[#F5F7F9] text-lg font-medium  hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border-none  rounded-[15px] text-lg font-medium text-white bg-[#007FFF] hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {task ? 'Save' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
