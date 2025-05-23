import { useAuth } from '../hooks/useAuth';
import LoginForm from '../components/LoginForm';

const Login = () => {
  const { login, isLoading } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-red py-12 px-4 sm:px-6 lg:px-8">
      <LoginForm 
        onSubmit={login} 
        isLoading={isLoading} 
      />
    </div>
  );
};

export default Login;