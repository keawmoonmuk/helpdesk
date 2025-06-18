
import { AxiosInstance } from 'axios';
import { setAuthHeader } from './index';

const authApi = (axiosInstance: AxiosInstance) => ({
  login: async (email: string, password: string) => {
    try {
      console.log('Login attempt with:', { email });
      
      const response = await axiosInstance.post('/auth/login', {
        email,
        password
      });
      
      console.log('Login response:', response.data);
      
      // Store token in localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        
        // Set token in Axios headers
        setAuthHeader(response.data.token);
      }
      
      return response.data;
    } catch (error: any) {
      console.error("Login error:", error.response ? error.response.data : error.message);
      throw new Error(error.response?.data?.message || 'Invalid credentials');
    }
  },

  logout: async () => {
    try {
      // Call the logout endpoint
      await axiosInstance.get('/auth/logout');
      
      // Remove token from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Remove token from Axios headers
      setAuthHeader(null);
    } catch (error: any) {
      console.error("Logout error:", error);
      // Even if server logout fails, clear local data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setAuthHeader(null);
    }
  },

  register: async (userData: any) => {
    try {
      console.log('API client register method called with:', userData);
      
      // Map the userData to match the expected format of your API
      const requestData = {
        userName: userData.username,
        fullName: userData.name,
        email: userData.email,
        password: userData.password,
        departmentId: userData.departmentId,
        role: userData.role.toUpperCase()
      };
      
      console.log('Sending registration data:', requestData);
      
      const response = await axiosInstance.post('/auth/register', requestData);
      console.log('Registration response:', response.data);
      
      return response.data;
    } catch (error: any) {
      console.error("Registration error details:", error);
      if (error.response) {
        console.error("Server response:", error.response.data);
        throw new Error(error.response.data.message || 'Registration failed due to server error');
      } else if (error.request) {
        console.error("No response from server:", error.request);
        throw new Error('No response from server. Please check your connection.');
      } else {
        console.error("Error during request setup:", error.message);
        throw new Error(error.message || 'Registration failed');
      }
    }
  },

  forgotPassword: async (email: string) => {
    try {
      const response = await axiosInstance.post('/auth/forgotpassword', { email });
      return response.data;
    } catch (error: any) {
      console.error("Forgot password error:", error.response ? error.response.data : error.message);
      throw new Error(error.response?.data?.message || 'Failed to request password reset');
    }
  },

  resetPassword: async (token: string, password: string) => {
    try {
      const response = await axiosInstance.post('/auth/reset-password', { 
        token, 
        password 
      });
      return response.data;
    } catch (error: any) {
      console.error("Reset password error:", error.response ? error.response.data : error.message);
      throw new Error(error.response?.data?.message || 'Failed to reset password');
    }
  }
});

export default authApi;
