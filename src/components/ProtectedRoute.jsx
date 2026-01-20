import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { axiosInstance } from '../api/axiosInstance.mjs';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verify httpOnly cookie is valid by calling /me endpoint
        const response = await axiosInstance.get('/auth/me');
        
        // Check if user has HR role
        if (response.data && response.data.role === 'HR') {
          // Store user data in localStorage for UI purposes
          localStorage.setItem('user', JSON.stringify(response.data));
          setIsAuthenticated(true);
        } else {
          // Wrong role - clear auth and stay on portal
          console.log('Wrong role for HR portal');
          localStorage.removeItem('user');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Authentication check failed:', error?.response?.status);
        
        // Clear localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        
        // Not authenticated - stay on portal (will show login)
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
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
