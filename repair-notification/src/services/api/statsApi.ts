
import { AxiosInstance } from 'axios';

const statsApi = (axiosInstance: AxiosInstance) => ({
  getDashboardStats: async () => {
    try {
      const response = await axiosInstance.get('/stats/dashboard');
      
      // If connected to real API, return the response
      // return response.data;
      
      // For simulation, return mock data
      return {
        activeRepairs: 8,
        completedToday: 3,
        pending: 5,
        urgent: 2
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        activeRepairs: 0,
        completedToday: 0,
        pending: 0,
        urgent: 0
      };
    }
  },
  
  getAssetStatistics: async () => {
    try {
      // In a real implementation, this would call the API
      // const response = await axiosInstance.get('/stats/assets');
      // return response.data;
      
      // For simulation, return mock data
      return {
        totalAssets: 145,
        byType: {
          computer: 87,
          printer: 23,
          server: 12,
          other: 23
        },
        byStatus: {
          active: 120,
          maintenance: 10,
          expired: 8,
          decommissioned: 7
        },
        byDepartment: {
          'IT': 35,
          'Marketing': 20,
          'Finance': 15,
          'HR': 18,
          'Sales': 22,
          'Operations': 28,
          'Other': 7
        }
      };
    } catch (error) {
      console.error('Error fetching asset statistics:', error);
      return {
        totalAssets: 0,
        byType: {},
        byStatus: {},
        byDepartment: {}
      };
    }
  },
  
  getRepairStatistics: async () => {
    try {
      // In a real implementation, this would call the API
      // const response = await axiosInstance.get('/stats/repairs');
      // return response.data;
      
      // For simulation, return mock data
      return {
        totalRepairs: 256,
        byMonth: [
          { month: 'Jan', count: 18 },
          { month: 'Feb', count: 22 },
          { month: 'Mar', count: 17 },
          { month: 'Apr', count: 28 },
          { month: 'May', count: 23 },
          { month: 'Jun', count: 19 },
          { month: 'Jul', count: 24 },
          { month: 'Aug', count: 31 },
          { month: 'Sep', count: 25 },
          { month: 'Oct', count: 20 },
          { month: 'Nov', count: 18 },
          { month: 'Dec', count: 11 }
        ],
        byStatus: {
          'Completed': 187,
          'In Progress': 42,
          'Pending': 27
        },
        byPriority: {
          'High': 68,
          'Medium': 130,
          'Low': 58
        }
      };
    } catch (error) {
      console.error('Error fetching repair statistics:', error);
      return {
        totalRepairs: 0,
        byMonth: [],
        byStatus: {},
        byPriority: {}
      };
    }
  }
});

export default statsApi;
