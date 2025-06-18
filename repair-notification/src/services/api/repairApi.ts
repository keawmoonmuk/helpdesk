
import { AxiosInstance } from 'axios';
import { createRepairFetchApi } from './repairs/repairFetchApi';
import { createRepairActionsApi } from './repairs/repairActionsApi';
import { createRepairSpecialOpsApi } from './repairs/repairSpecialOpsApi';

/**
 * Main repair API module that integrates all repair-related API functions
 */
const repairApi = (axiosInstance: AxiosInstance) => {
  const fetchApi = createRepairFetchApi(axiosInstance);
  const actionsApi = createRepairActionsApi(axiosInstance);
  const specialOpsApi = createRepairSpecialOpsApi(axiosInstance);
  
  return {
    // Fetch operations
    getRepairRequests: fetchApi.getRepairRequests,
    getRepairRequestById: fetchApi.getRepairRequestById,
    getRepairRequestsByTechnician: fetchApi.getRepairRequestsByTechnician,
    
    // CRUD operations
    addRepairRequest: actionsApi.addRepairRequest,
    updateRepairRequest: actionsApi.updateRepairRequest,
    deleteRepairRequest: actionsApi.deleteRepairRequest,
    
    // Special operations
    requestSupervisionApproval: specialOpsApi.requestSupervisionApproval,
    checkInRepair: specialOpsApi.checkInRepair,
    checkOutRepair: specialOpsApi.checkOutRepair
  };
};

export default repairApi;
