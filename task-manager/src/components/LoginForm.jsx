import { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { toast } from 'react-toastify';

const LoginForm = ({ onSubmit, isLoading }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [inputErrors, setInputErrors] = useState({
    username: false,
    password: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));

    if (inputErrors[name]) {
      setInputErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const validateInputs = () => {
    const errors = {
      username: !credentials.username.trim(),
      password: !credentials.password.trim()
    };
    setInputErrors(errors);
    return !Object.values(errors).some(Boolean);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateInputs()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await onSubmit(credentials);
    } catch (error) {
      console.log('err', error)
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="max-w-md w-full space-y-8 border border-blue-700 rounded-3xl p-6">
      <div>
        <img className="h-8 mx-auto" src="/Logo.png" alt="Logo" />
      </div>
      <div>
        <h2 className="mt-20 text-center text-[28px] font-semibold text-gray-900">
          Login
        </h2>
      </div>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <input type="hidden" name="remember" value="true" />
        <div className="space-y-px">
          <div>
            <p className='mb-[10px] text-sm font-semibold'>Username</p>
            <input
              id="username"
              name="username"
              type="text"
              required
              className={`appearance-none border-none bg-[#F5F7F9] relative block w-full px-3 py-2 placeholder-gray-500 text-gray-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#007FFF] focus:z-10 sm:text-sm h-[48px] ${
                inputErrors.username ? 'ring-2 ring-red-500' : ''
              }`}
              placeholder="Enter your username"
              value={credentials.username}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          <div>
            <p className='mb-[10px] mt-[15px] text-sm font-semibold'>Password</p>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                className={`appearance-none border-none relative block w-full px-3 py-2 bg-[#F5F7F9] placeholder-gray-500 text-gray-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#007FFF] focus:z-10 sm:text-sm h-[48px] pr-10 ${
                  inputErrors.password ? 'ring-2 ring-red-500' : ''
                }`}
                placeholder="Enter your password"
                value={credentials.password}
                onChange={handleChange}
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={togglePasswordVisibility}
                disabled={isLoading}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <FiEyeOff className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                ) : (
                  <FiEye className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="h-[48px] rounded-2xl group relative w-full flex justify-center items-center border border-transparent text-sm font-semibold text-white bg-[#007FFF] hover:bg-blue-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </span>
            ) : 'Login'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;