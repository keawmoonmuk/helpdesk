
import { AxiosInstance } from 'axios';
import { CreateRepairData, EditRepairData } from '@/types';
import { mapPriorityToImportance } from '../utils/formatUtils';

/**
 * API functions for managing repair actions (create, update, delete)
 */
export const createRepairActionsApi = (axiosInstance: AxiosInstance) => {
  return {
    addRepairRequest: async (repairData: CreateRepairData) => {
      try {
        console.log('Adding repair request:', repairData);
        
        const response = await axiosInstance.post('/repair/create', repairData);
        console.log('Add repair response:', response.data);
        
        return response.data;
      } catch (error: any) {
        console.error('Error adding repair request:', error);
        if (error.response) {
          throw new Error(error.response.data.message || 'Failed to create repair request');
        }
        throw error;
      }
    },
    
    updateRepairRequest: async (id: string, updateData: Partial<any>) => {
      try {
        console.log('Updating repair request:', id, updateData);
        
        // Prepare the request data based on the API requirements
        const requestData: EditRepairData = {
          departmentId: updateData.departmentId?.toString() || "1",
          building: updateData.building || "",
          floor: updateData.floor || "",
          assetName: updateData.assetName || "",
          assetSerial: updateData.assetSerial || "",
          assetCode: updateData.assetCode || "",
          assetLocation: updateData.assetLocation || "",
          detailRepair: updateData.detailRepair || updateData.problemDetails || "",
          importance: updateData.importance || mapPriorityToImportance(updateData.priority) || "MEDIUM",
          status: updateData.status || "PENDING",
          images: updateData.images || []
        };
        
        console.log('Sending update request with data:', requestData);
        const response = await axiosInstance.put(`/repair/edit/${id}`, requestData);
        console.log('Update response:', response.data);
        
        return response.data;
      } catch (error: any) {
        console.error('Error updating repair request:', error);
        const errorMessage = error.response?.data?.message || 'Failed to update repair request';
        console.error('Error message:', errorMessage);
        throw new Error(errorMessage);
      }
    },
    
    deleteRepairRequest: async (id: string) => {
      try {
        console.log('Deleting repair request with id:', id);
        
        const response = await axiosInstance.delete(`/repair/delete/${id}`);
        console.log('Delete response:', response.data);
        
        if (!response.data || response.data.error) {
          throw new Error(response.data?.message || 'Failed to delete repair request');
        }
        
        return { success: true, message: response.data.message || 'Successfully deleted repair request' };
      } catch (error: any) {
        console.error('Error deleting repair request:', error);
        const errorMessage = error.response?.data?.message || 'Failed to delete repair request';
        console.error('Error message:', errorMessage);
        throw new Error(errorMessage);
      }
    }
  };
};
