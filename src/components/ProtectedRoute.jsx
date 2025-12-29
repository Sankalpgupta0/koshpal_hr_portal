import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { axiosInstance } from '../api/axiosInstance.mjs';
import { logout } from '../api/auth';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');

      if (!token || !user) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        // Set the token in axios headers for this request
        const tempAxios = axiosInstance;
        tempAxios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Verify token is still valid
        const response = await tempAxios.get('/auth/me');
        const userData = JSON.parse(user);

        if (response.data && userData.role === 'HR') {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error('Token validation failed:', error?.response?.status, error?.message);
        // Clear invalid tokens
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Try to logout on server side too
        try {
          await logout();
        } catch (logoutError) {
          console.log('Server logout failed, but continuing');
        }
        
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ animation: 'spin 1s linear infinite', border: '2px solid #f3f3f3', borderTop: '2px solid #3498db', borderRadius: '50%', width: '40px', height: '40px' }}></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
