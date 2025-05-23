import { useAuth } from '../hooks/useAuth';
import { Navigate, useLocation } from 'react-router-dom';

const FullPageSpinner = () => (
  <div className="fixed inset-0 flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
  </div>
);

export const ProtectedRoute = ({ children }) => {
  const { user, loading, isSettingToken } = useAuth();
  const location = useLocation();

  if (loading || isSettingToken) {
    return <FullPageSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};