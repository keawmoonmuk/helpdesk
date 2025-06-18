
import { AxiosInstance } from 'axios';

/**
 * API functions for specialized repair operations like approvals and check-in/out
 */
export const createRepairSpecialOpsApi = (axiosInstance: AxiosInstance) => {
  return {
    requestSupervisionApproval: async (requestData: {
      repairId: string;
      actionType: 'in-house-parts' | 'external-repair' | 'new-purchase';
      remarks: string;
    }) => {
      try {
        console.log('Requesting supervision approval:', requestData);
        
        // When connected to real API:
        // const response = await axiosInstance.post('/repair/approval-request', requestData);
        // return response.data;
        
        // Simulate successful API response
        return {
          success: true,
          message: 'Approval request sent successfully',
          requestId: 'REQ-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0')
        };
      } catch (error) {
        console.error('Error requesting approval:', error);
        throw error;
      }
    },
    
    checkInRepair: async (repairId: string) => {
      try {
        const response = await axiosInstance.post(`/repair/check-in/${repairId}`);
        return response.data;
      } catch (error) {
        console.error('Error checking in repair:', error);
        throw error;
      }
    },
    
    checkOutRepair: async (repairId: string) => {
      try {
        const response = await axiosInstance.post(`/repair/check-out/${repairId}`);
        return response.data;
      } catch (error) {
        console.error('Error checking out repair:', error);
        throw error;
      }
    }
  };
};
