import { axiosInstance } from './axiosInstance.mjs';

/**
 * Get all employees for the company
 */
export const getEmployees = async () => {
  const response = await axiosInstance.get('/hr/employees');
  return response.data;
};

/**
 * Get all departments for the company
 */
export const getDepartments = async () => {
  const response = await axiosInstance.get('/hr/employees/departments/list');
  return response.data;
};

/**
 * Get single employee by ID
 */
export const getEmployee = async (id) => {
  const response = await axiosInstance.get(`/hr/employees/${id}`);
  return response.data;
};

/**
 * Update employee status
 */
export const updateEmployeeStatus = async (id, isActive) => {
  const response = await axiosInstance.patch(`/hr/employees/${id}/status`, { isActive });
  return response.data;
};

/**
 * Upload employees CSV file
 */
export const uploadEmployees = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await axiosInstance.post('/hr/employees/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Get all upload batches
 */
export const getUploads = async () => {
  const response = await axiosInstance.get('/hr/uploads');
  return response.data;
};

/**
 * Get upload batch status by ID
 */
export const getUploadStatus = async (batchId) => {
  const response = await axiosInstance.get(`/hr/uploads/${batchId}`);
  return response.data;
};

/**
 * Get company insights summary
 */
export const getInsightsSummary = async () => {
  const response = await axiosInstance.get('/hr/insights/summary');
  return response.data;
};

/**
 * Get HR profile
 */
export const getHrProfile = async () => {
  const response = await axiosInstance.get('/hr/profile');
  return response.data;
};

/**
 * Update HR profile
 */
export const updateHrProfile = async (updateData) => {
  const response = await axiosInstance.patch('/hr/profile', updateData);
  return response.data;
};

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async () => {
  const response = await axiosInstance.get('/hr/dashboard/stats');
  return response.data;
};

/**
 * Get financial health distribution
 */
export const getFinancialHealthDistribution = async () => {
  const response = await axiosInstance.get('/hr/dashboard/financial-health');
  return response.data;
};

/**
 * Get participation by department
 */
export const getParticipationByDepartment = async () => {
  const response = await axiosInstance.get('/hr/dashboard/participation-by-department');
  return response.data;
};

/**
 * Get dashboard alerts
 */
export const getDashboardAlerts = async () => {
  const response = await axiosInstance.get('/hr/dashboard/alerts');
  return response.data;
};
