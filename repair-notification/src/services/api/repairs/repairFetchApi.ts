
import { AxiosInstance } from 'axios';
import { RepairRequest } from '@/types';
import { ApiResponseWithRepairRequest } from '../utils/repairMappers';

/**
 * API functions for fetching repair data
 */
export const createRepairFetchApi = (axiosInstance: AxiosInstance) => {
  return {
    getRepairRequests: async () => {
      try {
        console.log('Fetching repair requests from API...');
        const response = await axiosInstance.get('/repair/lists');
        
        console.log('API response:', response.data);
        
        // Check the structure of the response
        if (!response.data || !response.data.data) {
          console.warn('Unexpected API response structure:', response.data);
          return [];
        }
        
        // Extract the data array from the response
        const dataArray = response.data.data || [];
        
        if (!Array.isArray(dataArray)) {
          console.warn('API response data is not an array:', dataArray);
          return [];
        }
        
        // Process the response to match our RepairRequest structure
        const mappedRequests = dataArray.map((item) => {
          // Map API response to RepairRequest structure
          return {
            id: item.id || '',
            title: item.title || '',
            description: item.description || '',
            status: item.status || 'pending',
            priority: item.priority || 'medium',
            createdAt: item.created_at || new Date().toISOString(),
            updatedAt: item.updated_at || new Date().toISOString(),
            problemDetails: item.problem_details || '',
            reporter: item.reporter || '',
            technician: item.technician || '',
            dateReported: item.date_reported || new Date().toISOString(),
            // Add other fields as needed
          } as RepairRequest;
        });
        
        console.log('Mapped repair requests:', mappedRequests);
        return mappedRequests;
      } catch (error) {
        console.error('Error fetching repair requests:', error);
        return [];
      }
    },
    
    getRepairRequestsByTechnician: async (technicianId: number) => {
      try {
        const allRequests = await repairFetchApi.getRepairRequests();
        return allRequests.filter((req: RepairRequest) => req.technician === 'ช่างเอก');
      } catch (error) {
        console.error(`Error fetching repair requests for technician:`, error);
        throw error;
      }
    },
    
    getRepairRequestById: async (id: string) => {
      try {
        const response = await axiosInstance.get(`/repair/${id}`);
        
        if (!response.data) {
          throw new Error('Repair request not found');
        }
        
        // Map API response to RepairRequest structure
        const item = response.data;
        return {
          id: item.id || '',
          title: item.title || '',
          description: item.description || '',
          status: item.status || 'pending',
          priority: item.priority || 'medium',
          createdAt: item.created_at || new Date().toISOString(),
          updatedAt: item.updated_at || new Date().toISOString(),
          problemDetails: item.problem_details || '',
          reporter: item.reporter || '',
          technician: item.technician || '',
          dateReported: item.date_reported || new Date().toISOString(),
          // Add other fields as needed
        } as RepairRequest;
      } catch (error) {
        console.error(`Error fetching repair request with id ${id}:`, error);
        throw error;
      }
    }
  };
};

const repairFetchApi = {
  getRepairRequests: async () => [],
  getRepairRequestById: async (id: string) => ({} as RepairRequest),
  getRepairRequestsByTechnician: async (id: number) => ([] as RepairRequest[]),
};

export default repairFetchApi;
