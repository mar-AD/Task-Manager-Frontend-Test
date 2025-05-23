import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import Login from './pages/Login';
import Tasks from './pages/Tasks';
import {ProtectedRoute} from './components/protectedRoute';

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route 
          path="/tasks" 
          element={
            <ProtectedRoute>
              <Tasks />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Login />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;