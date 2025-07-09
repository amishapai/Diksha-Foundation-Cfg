import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RoleBasedRedirect = () => {
  const { userData, currentUser, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && currentUser && userData) {
      // Redirect based on user role
      if (userData.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/student', { replace: true });
      }
    } else if (!loading && !currentUser) {
      // If not logged in, redirect to login
      navigate('/login', { replace: true });
    }
  }, [userData, currentUser, loading, navigate]);

  // Show loading while determining redirect
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-emerald-600 font-medium">Redirecting...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default RoleBasedRedirect;
