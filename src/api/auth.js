import { axiosInstance } from './axiosInstance.mjs';

/**
 * HR login
 */
export const loginHR = async (credentials) => {
  try {
    const response = await axiosInstance.post('/auth/login', {
      ...credentials,
      role: 'HR' // Specify HR role for unified login
    });
    const { user } = response.data;
    
    console.log('Login response:', response.data);
    
    // Verify user is HR
    if (user.role !== 'HR') {
      throw new Error('Unauthorized: Only HR users can access this portal');
    }
    
    // Store user data in localStorage (tokens are in httpOnly cookies)
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
    
    return {
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name || user.email,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
      },
    };
  } catch (error) {
    console.error('Login API error:', error);
    throw error;
  }
};

/**
 * Get current user
 */
export const getCurrentUser = async () => {
  const response = await axiosInstance.get('/auth/me');
  return response.data;
};

/**
 * Logout
 */
export const logout = async () => {
  try {
    await axiosInstance.post('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  } catch (error) {
    console.error('Logout error:', error);
    // Clear local storage anyway
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

/**
 * Request OTP for password reset
 */
export const forgotPassword = async (email) => {
  const response = await axiosInstance.post('/auth/forgot-password', {
    email,
    portal: 'HR',
  });
  return response.data;
};

/**
 * Verify OTP for password reset
 */
export const verifyOtp = async (email, otp) => {
  const response = await axiosInstance.post('/auth/verify-otp', {
    email,
    otp,
  });
  return response.data;
};

/**
 * Reset password using temporary token from verifyOtp
 */
export const resetPasswordOtp = async (tempToken, newPassword) => {
  const response = await axiosInstance.post(`/auth/reset-password/${tempToken}`, {
    newPassword,
  });
  return response.data;
};

/**
 * Change password for authenticated user
 */
export const changePassword = async (currentPassword, newPassword) => {
  const response = await axiosInstance.patch('/auth/me/password', {
    currentPassword,
    newPassword,
  });
  return response.data;
};
