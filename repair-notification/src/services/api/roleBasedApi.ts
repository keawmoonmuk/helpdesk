import { AxiosInstance } from 'axios';
import { useAuth } from '@/contexts/AuthContext';

// Base interfaces for API responses
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T = any> extends ApiResponse {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Create role-specific API clients based on the user's role
const createRoleBasedApi = (axiosInstance: AxiosInstance) => {
  // User role API endpoints
  const userApi = {
    // Assets endpoints
    assets: {
      getMyAssets: async () => {
        const response = await axiosInstance.get('/users/my-assets');
        return response.data;
      },
      getAllAssets: async () => {
        const response = await axiosInstance.get('/users/assets');
        return response.data;
      },
      updateAsset: async (id: number, data: any) => {
        const response = await axiosInstance.put(`/users/asset/${id}`, data);
        return response.data;
      },
      deleteAsset: async (id: number) => {
        const response = await axiosInstance.delete(`/users/asset/${id}`);
        return response.data;
      }
    },
    
    // Schedule endpoints
    schedule: {
      getSchedule: async () => {
        const response = await axiosInstance.get('/users/schedule');
        return response.data;
      },
      updateSchedule: async (id: number, data: any) => {
        const response = await axiosInstance.put(`/users/schedule/${id}`, data);
        return response.data;
      }
    },
    
    // Settings endpoints
    settings: {
      getSettings: async () => {
        const response = await axiosInstance.get('/users/settings');
        return response.data;
      },
      updateSettings: async (id: number, data: any) => {
        const response = await axiosInstance.put(`/users/settings/${id}`, data);
        return response.data;
      },
      createSetting: async (data: any) => {
        const response = await axiosInstance.post('/users/setting', data);
        return response.data;
      }
    },
    
    // Dashboard endpoints
    dashboard: {
      getDashboard: async () => {
        const response = await axiosInstance.get('/users/dashboards');
        return response.data;
      },
      addRepair: async (data: any) => {
        const response = await axiosInstance.post('/users/add-repair', data);
        return response.data;
      },
      updateRepair: async (id: number, data: any) => {
        const response = await axiosInstance.put(`/users/edit-repair/${id}`, data);
        return response.data;
      },
      deleteRepair: async (id: number) => {
        const response = await axiosInstance.delete(`/users/delete-repair/${id}`);
        return response.data;
      }
    },
    
    // Notification endpoints
    notifications: {
      getNotifications: async () => {
        const response = await axiosInstance.get('/users/notifications');
        return response.data;
      }
    },
    
    // Reports endpoints
    reports: {
      getReports: async () => {
        const response = await axiosInstance.get('/users/reports');
        return response.data;
      }
    }
  };
  
  // Technician role API endpoints - Updated with correct endpoints
  const technicianApi = {
    // Dashboard endpoints
    dashboard: {
      getDashboard: async () => {
        const response = await axiosInstance.get('/technicians/dashboards');
        return response.data;
      }
    },
    
    // Settings endpoints
    settings: {
      getSettings: async () => {
        const response = await axiosInstance.get('/technicians/settings');
        return response.data;
      },
      updateSettings: async (id: number, data: any) => {
        const response = await axiosInstance.put(`/technicians/settings/${id}`, data);
        return response.data;
      },
      createSetting: async (data: any) => {
        const response = await axiosInstance.post('/technicians/setting', data);
        return response.data;
      }
    },
    
    // Schedule endpoints
    schedule: {
      getSchedule: async () => {
        const response = await axiosInstance.get('/technicians/schedule');
        return response.data;
      },
      updateSchedule: async (id: number, data: any) => {
        const response = await axiosInstance.put(`/technicians/schedule/${id}`, data);
        return response.data;
      }
    },
    
    // Tasks endpoints
    tasks: {
      getTasks: async () => {
        const response = await axiosInstance.get('/technicians/task');
        return response.data;
      },
      createTask: async (data: any) => {
        const response = await axiosInstance.post('/technicians/task', data);
        return response.data;
      },
      updateTask: async (id: number, data: any) => {
        const response = await axiosInstance.put(`/technicians/task/${id}`, data);
        return response.data;
      },
      deleteTask: async (id: number) => {
        const response = await axiosInstance.delete(`/technicians/task/${id}`);
        return response.data;
      }
    },
    
    // Notification endpoints
    notifications: {
      getNotifications: async () => {
        const response = await axiosInstance.get('/technicians/notifications');
        return response.data;
      }
    },
    
    // Reports endpoints
    reports: {
      getReports: async () => {
        const response = await axiosInstance.get('/technicians/reports');
        return response.data;
      }
    }
  };
  
  // Admin role API endpoints
  const adminApi = {
    // Settings endpoints
    settings: {
      getSettings: async () => {
        const response = await axiosInstance.get('/admin/settings');
        return response.data;
      },
      updateSettings: async (id: number, data: any) => {
        const response = await axiosInstance.put(`/admin/settings/${id}`, data);
        return response.data;
      },
      createSetting: async (data: any) => {
        const response = await axiosInstance.post('/admin/setting', data);
        return response.data;
      }
    },
    
    // Schedule endpoints
    schedule: {
      getSchedule: async () => {
        const response = await axiosInstance.get('/admin/schedule');
        return response.data;
      },
      updateSchedule: async (id: number, data: any) => {
        const response = await axiosInstance.put(`/admin/schedule/${id}`, data);
        return response.data;
      }
    },
    
    // Departments endpoints
    departments: {
      getDepartments: async () => {
        const response = await axiosInstance.get('/admin/list-department');
        return response.data;
      },
      createDepartment: async (data: { departmentName: string }) => {
        const response = await axiosInstance.post('/admin/add-department', data);
        return response.data;
      },
      updateDepartment: async (id: number, data: any) => {
        const response = await axiosInstance.put(`/admin/edit-department/${id}`, data);
        return response.data;
      },
      deleteDepartment: async (id: number) => {
        const response = await axiosInstance.delete(`/admin/delete-department/${id}`);
        return response.data;
      }
    },
    
    // Users endpoints
    users: {
      getUsers: async () => {
        const response = await axiosInstance.get('/admin/users');
        return response.data;
      },
      createUser: async (data: any) => {
        const response = await axiosInstance.post('/admin/user', data);
        return response.data;
      },
      updateUser: async (id: number, data: any) => {
        const response = await axiosInstance.put(`/admin/user/${id}`, data);
        return response.data;
      },
      deleteUser: async (id: number) => {
        const response = await axiosInstance.delete(`/admin/user/${id}`);
        return response.data;
      }
    },
    
    // Assets endpoints
    assets: {
      getAssets: async () => {
        const response = await axiosInstance.get('/admin/assets');
        return response.data;
      },
      createAsset: async (data: any) => {
        const response = await axiosInstance.post('/admin/add-assets', data);
        return response.data;
      },
      updateAsset: async (id: number, data: any) => {
        const response = await axiosInstance.put(`/admin/asset/${id}`, data);
        return response.data;
      },
      deleteAsset: async (id: number) => {
        const response = await axiosInstance.delete(`/admin/asset/${id}`);
        return response.data;
      }
    },
    
    // Tasks endpoints
    tasks: {
      getTasks: async () => {
        const response = await axiosInstance.get('/admin/tasks');
        return response.data;
      },
      createTask: async (data: any) => {
        const response = await axiosInstance.post('/admin/add-task', data);
        return response.data;
      },
      updateTask: async (id: number, data: any) => {
        const response = await axiosInstance.put(`/admin/task/${id}`, data);
        return response.data;
      },
      deleteTask: async (id: number) => {
        const response = await axiosInstance.delete(`/admin/task/${id}`);
        return response.data;
      }
    },
    
    // Dashboard/repair endpoints
    repairs: {
      getRepairs: async () => {
        const response = await axiosInstance.get('/admin/repairs');
        return response.data;
      },
      createRepair: async (data: any) => {
        const response = await axiosInstance.post('/admin/add-repair', data);
        return response.data;
      },
      updateRepair: async (id: number, data: any) => {
        const response = await axiosInstance.put(`/admin/repair/${id}`, data);
        return response.data;
      },
      deleteRepair: async (id: number) => {
        const response = await axiosInstance.delete(`/admin/repair/${id}`);
        return response.data;
      }
    },
    
    // Notification endpoints
    notifications: {
      getNotifications: async () => {
        const response = await axiosInstance.get('/admin/notifications');
        return response.data;
      }
    },
    
    // Reports endpoints
    reports: {
      getReports: async () => {
        const response = await axiosInstance.get('/admin/reports');
        return response.data;
      }
    }
  };

  return {
    user: userApi,
    technician: technicianApi,
    admin: adminApi
  };
};

export default createRoleBasedApi;
