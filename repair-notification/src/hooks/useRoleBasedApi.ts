
import { useAuth } from '@/contexts/AuthContext';
import apiClient from '@/services/api';

// Hook to get API endpoints based on user role
export const useRoleBasedApi = () => {
  const { user } = useAuth();
  
  // Get the API client for the current user role
  const roleApi = user ? apiClient.getApiForRole(user.role) : apiClient.user;
  
  // Check if the user can access a specific endpoint
  const canAccess = (endpoint: string): boolean => {
    if (!user) return false;
    
    switch (user.role) {
      case 'admin':
        // Admin has access to all endpoints
        return true;
      case 'technician':
        // Technicians can access their own endpoints and user endpoints
        return endpoint.startsWith('technician.') || endpoint.startsWith('user.');
      case 'user':
        // Users can only access user endpoints
        return endpoint.startsWith('user.');
      default:
        return false;
    }
  };
  
  // Get the appropriate API based on the current user role
  return {
    // For each module, provide the appropriate version based on the user role
    dashboard: user?.role === 'admin' ? apiClient.admin.repairs : 
               user?.role === 'technician' ? apiClient.technician.dashboard : 
               apiClient.user.dashboard,
    
    assets: user?.role === 'admin' ? apiClient.admin.assets : apiClient.user.assets,
    
    schedule: user?.role === 'admin' ? apiClient.admin.schedule : 
              user?.role === 'technician' ? apiClient.technician.schedule : 
              apiClient.user.schedule,
    
    settings: user?.role === 'admin' ? apiClient.admin.settings : 
              user?.role === 'technician' ? apiClient.technician.settings : 
              apiClient.user.settings,
    
    tasks: user?.role === 'admin' ? apiClient.admin.tasks : 
           user?.role === 'technician' ? apiClient.technician.tasks : null,
    
    // Ensure departments is properly defined for admin users
    departments: user?.role === 'admin' ? apiClient.admin.departments : null,
    
    users: user?.role === 'admin' ? apiClient.admin.users : null,
    
    notifications: user?.role === 'admin' ? apiClient.admin.notifications : 
                  user?.role === 'technician' ? apiClient.technician.notifications : 
                  apiClient.user.notifications,
    
    reports: user?.role === 'admin' ? apiClient.admin.reports : 
             user?.role === 'technician' ? apiClient.technician.reports : 
             apiClient.user.reports,
    
    // Utilities
    canAccess,
    roleApi,
    role: user?.role || 'guest'
  };
};
