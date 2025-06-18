
import axios from 'axios';
import authApi from './authApi';
import createRoleBasedApi from './roleBasedApi';

const API_BASE_URL = 'http://localhost:5000/api';

// Set up Axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to set JWT token in headers
export const setAuthHeader = (token: string | null) => {
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log('Auth header set');
  } else {
    delete axiosInstance.defaults.headers.common['Authorization'];
    console.log('Auth header removed');
  }
};

// Initialize with token from localStorage if available
const storedToken = localStorage.getItem('token');
if (storedToken) {
  setAuthHeader(storedToken);
}

// Create role-based API clients
const roleBasedApi = createRoleBasedApi(axiosInstance);

// Export a unified API client
const apiClient = {
  // Authentication endpoints
  ...authApi(axiosInstance),
  
  // Role-specific endpoints
  user: roleBasedApi.user,
  technician: roleBasedApi.technician,
  admin: roleBasedApi.admin,
  
  // Utility to get the correct API based on user role
  getApiForRole: (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return roleBasedApi.admin;
      case 'technician':
        return roleBasedApi.technician;
      case 'user':
      default:
        return roleBasedApi.user;
    }
  },
  
  // Utility to format dates
  formatDate: (dateString: string): string => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      
      // Format: DD/MM/YYYY HH:MM
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  }
};

export default apiClient;
