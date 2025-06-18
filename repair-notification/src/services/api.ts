
import axios from 'axios';
import { CreateRepairData, EditRepairData, RepairRequest, UserAsset, RepairRecord, OwnershipRecord, ResponsibleParty } from '@/types';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api'; // ใช้ค่าจาก .env หรือ fallback เป็น localhost

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

// Sample data for simulating asset functionality
const MOCK_ASSETS: UserAsset[] = [
  {
    id: 'asset-001',
    userId: 'user-001',
    assetName: 'Dell Latitude 5420',
    assetCode: 'LAP-001',
    assetLocation: 'แผนก IT ชั้น 3 อาคาร 1', 
    serialNumber: 'DLLAT542089J3',
    assetType: 'computer',
    purchaseDate: '2022-03-15',
    expirationDate: '2025-03-15',
    model: 'Latitude 5420',
    manufacturer: 'Dell',
    assetCategory: 'hardware',
    status: 'active',
    responsibleDepartment: 'IT',
    responsibleEmployee: 'John Doe',
    responsibleIT: 'Jane Smith',
    repairHistory: [
      {
        id: 'repair-001',
        date: '2022-09-10',
        description: 'Screen replacement due to dead pixels',
        cost: 8500,
        technician: 'Mike Johnson',
        status: 'completed',
        parts: ['LCD Panel', 'Display Cable']
      },
      {
        id: 'repair-002',
        date: '2023-01-15',
        description: 'Battery replacement',
        cost: 3200,
        technician: 'Sarah Williams',
        status: 'completed',
        parts: ['Battery Pack']
      }
    ],
    ownershipHistory: [
      {
        id: 'ownership-001',
        previousOwner: 'Alice Cooper',
        previousDepartment: 'Marketing',
        transferDate: '2022-06-20',
        reason: 'Department transfer'
      },
      {
        id: 'ownership-002',
        previousOwner: 'Bob Richards',
        previousDepartment: 'Sales',
        transferDate: '2023-02-10',
        reason: 'Equipment upgrade',
        documentReference: 'TR-20230210-001'
      }
    ],
    responsibleParties: [
      {
        id: 'resp-001',
        type: 'department',
        name: 'IT Department',
        email: 'it@company.com',
        phone: '123-456-7890',
        startDate: '2022-03-15'
      },
      {
        id: 'resp-002',
        type: 'employee',
        name: 'John Doe',
        email: 'john.doe@company.com',
        phone: '123-456-7891',
        startDate: '2022-03-15',
        endDate: '2022-06-20'
      },
      {
        id: 'resp-003',
        type: 'employee',
        name: 'Jane Smith',
        email: 'jane.smith@company.com',
        phone: '123-456-7892',
        startDate: '2022-06-21'
      }
    ]
  },
  {
    id: 'asset-002',
    userId: 'user-001',
    assetName: 'HP LaserJet Pro MFP',
    assetCode: 'PRT-001',
    assetLocation: 'แผนก CCD ชั้น 2 อาคาร 2',
    serialNumber: 'HPLJ6739MFP',
    assetType: 'printer',
    purchaseDate: '2021-11-05',
    expirationDate: '2024-11-05',
    model: 'LaserJet Pro MFP M283fdw',
    manufacturer: 'HP',
    assetCategory: 'hardware',
    status: 'active',
    repairHistory: [
      {
        id: 'repair-003',
        date: '2022-07-22',
        description: 'Paper roller replacement',
        cost: 1500,
        technician: 'Mike Johnson',
        status: 'completed',
        parts: ['Paper Roller Assembly']
      }
    ]
  }
];

// Define the user, technician, and admin API endpoints
const userApi = {
  dashboard: {
    getDashboard: async () => ({ data: { stats: { activeRepairs: 2, completedToday: 1 } } })
  },
  assets: {
    getAllAssets: async () => ({ data: MOCK_ASSETS }),
  },
  schedule: {
    getSchedule: async () => ({ data: [] })
  },
  settings: {
    getSettings: async () => ({ data: {} })
  },
  notifications: {
    getNotifications: async () => ({ data: [] })
  },
  reports: {
    getReports: async () => ({ data: [] })
  }
};

const technicianApi = {
  dashboard: {
    getDashboard: async () => ({ data: { stats: { activeRepairs: 5, completedToday: 2 } } })
  },
  tasks: {
    getTasks: async () => ({ data: [] })
  },
  schedule: {
    getSchedule: async () => ({ data: [] })
  },
  settings: {
    getSettings: async () => ({ data: {} })
  },
  notifications: {
    getNotifications: async () => ({ data: [] })
  },
  reports: {
    getReports: async () => ({ data: [] })
  }
};

const adminApi = {
  repairs: {
    getRepairs: async () => ({ data: [] })
  },
  assets: {
    getAssets: async () => ({ data: MOCK_ASSETS })
  },
  schedule: {
    getSchedule: async () => ({ data: [] })
  },
  settings: {
    getSettings: async () => ({ data: {} })
  },
  departments: {
    getDepartments: async () => ({ data: [] })
  },
  users: {
    getUsers: async () => ({ data: [] })
  },
  tasks: {
    getTasks: async () => ({ data: [] })
  },
  notifications: {
    getNotifications: async () => ({ data: [] })
  },
  reports: {
    getReports: async () => ({ data: [] })
  }
};

const apiClient = {
  // Authentication methods
  login: async (userName: string, password: string) => {
    try {
      console.log('Login attempt with:', { userName });
      
      const response = await axiosInstance.post('/auth/login', {
        userName,
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

  logout: () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Remove token from Axios headers
    setAuthHeader(null);
  },

  register: async (userData: any) => {
    try {
      console.log('API client register method called with:', userData);
      
      // Map the userData
      const requestData = {
        userName: userData.username,
        fullName: userData.name,
        email: userData.email,
        password: userData.password,
        departmentId: userData.departmentId, // Send department as numeric ID
        role: userData.role.toUpperCase() // Make sure role is in uppercase
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
      const response = await axiosInstance.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error: any) {
      console.error("Forgot password error:", error.response ? error.response.data : error.message);
      throw new Error(error.response?.data?.message || 'Failed to request password reset');
    }
  },

  resetPassword: async (token: string, password: string) => {
    try {
      const response = await axiosInstance.post('/auth/reset-password', { token, password });
      return response.data;
    } catch (error: any) {
      console.error("Reset password error:", error.response ? error.response.data : error.message);
      throw new Error(error.response?.data?.message || 'Failed to reset password');
    }
  },

  // Role-based APIs
  user: userApi,
  technician: technicianApi,
  admin: adminApi,
  
  // Utility to get the correct API based on user role
  getApiForRole: (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return adminApi;
      case 'technician':
        return technicianApi;
      case 'user':
      default:
        return userApi;
    }
  },

    //ส่วนของการ ดึงข้อมูลแผนก เพิ่มแผนก แก้ไขแผนก ลบแผนก
getDepartments: async () =>  {
  try {
    const response = await axiosInstance.get('/admin/departments');
    console.log('Departments response:', response.data);

    if(!response.data || !Array.isArray(response.data)){
      console.warn('Unexpected API response structure:', response.data);
      return [];
    }
return response.data.map((dept: any) => ({
  value : dept.departmentId.toString(),   //ใช้ departmentId ในรูปแบบของ string
  label : dept.departmentName,
}));
  } catch (error: any) {
    console.error('Error fetching departments:', error);
    return [];
  }
},
  
getDashboardStats: async () => {
  try {
    const requests = await apiClient.getRepairRequests();

    // Helper: normalize status/importance
    const normalize = (val: string) => (val || '').toUpperCase().replace(/\s/g, '_');

    const today = new Date().toISOString().split('T')[0];

    const activeRepairs = requests.filter(
      r => ['IN_PROGRESS', 'PENDING'].includes(normalize(r.status))
    ).length;

    const completedToday = requests.filter(r => {
      const status = normalize(r.status);
      if (status !== 'COMPLETED' || !r.updated_at) return false;
      // Extract date part only (YYYY-MM-DD)
      const updatedDate = new Date(r.updated_at).toISOString().split('T')[0];
      return updatedDate === today;
    }).length;

    const pending = requests.filter(r => normalize(r.status) === 'PENDING').length;
    const urgent = requests.filter(r => normalize(r.importance) === 'HIGH').length;

    return {
      activeRepairs,
      completedToday,
      pending,
      urgent
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

  //ดึงข้อมูลคำขอซ่อมทั้งหมด
  getRepairRequests: async () => {
    try {
      console.log('Fetching repair requests from API...');
      const response = await axiosInstance.get('/users/repairs');
      
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
      const mappedRequests = dataArray.map((item: any) => ({
        id: item.requestId?.toString() || '',
        problemDetails: item.detail || '',
        detail: item.detail || '',
        dateReported: formatDate(item.created_at),
        create_at: item.created_at,
        reporter: item.creator?.fullName || '',
        reporterFullName: item.creator?.fullName || '',
        department: item.department?.departmentName || '',
        building: item.building || '',
        floor: item.floor || '',
        departmentId: item.departmentId,
        technician: item.inspected_by || '',
        inspected_by: item.inspected_by || '',
        inspector: item.inspector || null,
        status: item.status || 'PENDING',
        priority: mapImportanceToPriority(item.importance),
        importance: item.importance,
        assetName: item.asset?.assetName || '',
        assetCode: item.asset?.assetCode || '',
        assetLocation: item.asset?.assetLocation || (item.location || ''),
        asset: item.asset,
        creator: item.creator,
        checkInDate: item.inspected_at ? formatDate(item.inspected_at) : null,
        checkOutDate: item.checkout_at ? formatDate(item.checkout_at) : null,
        lastUpdated: item.updated_at ? formatDate(item.updated_at) : '',
        updated_at: item.updated_at
      }));
      
      console.log('Mapped repair requests:', mappedRequests);
      return mappedRequests;
    } catch (error) {
      console.error('Error fetching repair requests:', error);
      return [];
    }
  },
  
  getRepairRequestsByTechnician: async (technicianId: number) => {
    try {
      const allRequests = await apiClient.getRepairRequests();
      return allRequests.filter(req => req.technician === 'ช่างเอก');
    } catch (error) {
      console.error(`Error fetching repair requests for technician:`, error);
      throw error;
    }
  },
  
  getRepairRequestById: async (id: string) => {
    try {
      const allRequests = await apiClient.getRepairRequests();
      const request = allRequests.find(req => req.id === id);
      
      if (!request) {
        throw new Error('Repair request not found');
      }
      
      return request;
    } catch (error) {
      console.error(`Error fetching repair request with id ${id}:`, error);
      throw error;
    }
  },
  
  // Add a new repair request
  addRepairRequest: async (repairData: CreateRepairData) => {
    try {
      console.log('Adding repair request:', repairData);
      
      const response = await axiosInstance.post('/users/add-repair', repairData);
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
  
  // update แก้ไขคำขอซ่อม
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
      const response = await axiosInstance.put(`/users/edit-repair/${id}`, requestData);
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
      
      const response = await axiosInstance.delete(`/users/delete-repair/${id}`);
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
  },
  
  requestSupervisionApproval: async (requestData: {
    repairId: string;
    actionType: 'in-house-parts' | 'external-repair' | 'new-purchase';
    remarks: string;
  }) => {
    try {
      console.log('Requesting supervision approval:', requestData);
      
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
      const repair = await apiClient.getRepairRequestById(repairId);
      if (!repair) {
        throw new Error('Repair request not found');
      }
      
      // Update the repair with check-in date
      return await apiClient.updateRepairRequest(repairId, {
        ...repair,
        checkInDate: new Date().toLocaleString(),
        status: 'In Progress'
      });
    } catch (error) {
      console.error('Error checking in repair:', error);
      throw error;
    }
  },
  
  checkOutRepair: async (repairId: string) => {
    try {
      const repair = await apiClient.getRepairRequestById(repairId);
      if (!repair) {
        throw new Error('Repair request not found');
      }
      
      // Update the repair with check-out date
      return await apiClient.updateRepairRequest(repairId, {
        ...repair,
        checkOutDate: new Date().toLocaleString(),
        status: 'Completed'
      });
    } catch (error) {
      console.error('Error checking out repair:', error);
      throw error;
    }
  },

  // Asset management functionality
  asset: {
    getUserAssets: async (userId: string): Promise<UserAsset[]> => {
      try {
        console.log('Fetching assets for user:', userId);
        
        // In a real implementation, we would make an API call here
        // const response = await axiosInstance.get(`/assets/user/${userId}`);
        // return response.data;
        
        // For now, return simulated data with a small delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Filter assets for the specified user ID
        return MOCK_ASSETS.filter(asset => asset.userId === userId);
      } catch (error) {
        console.error('Error fetching user assets:', error);
        throw error;
      }
    },
    
    getAssetById: async (assetId: string): Promise<UserAsset> => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const asset = MOCK_ASSETS.find(a => a.id === assetId);
        
        if (!asset) {
          throw new Error('Asset not found');
        }
        
        return asset;
      } catch (error) {
        console.error('Error fetching asset details:', error);
        throw error;
      }
    },
    
    addAsset: async (assetData: Partial<UserAsset>): Promise<UserAsset> => {
      try {
        console.log('Adding new asset:', assetData);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 700));
        
        // Create a new asset with the provided data
        const newAsset: UserAsset = {
          id: `asset-${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`,
          userId: assetData.userId || '',
          assetName: assetData.assetName || '',
          assetCode: assetData.assetCode || '',
          assetLocation: assetData.assetLocation || '',
          serialNumber: assetData.serialNumber || '',
          assetType: assetData.assetType || 'other',
          assetCategory: assetData.assetCategory || 'other',
          status: assetData.status || 'active',
          purchaseDate: assetData.purchaseDate,
          expirationDate: assetData.expirationDate,
          model: assetData.model,
          manufacturer: assetData.manufacturer,
          responsibleDepartment: assetData.responsibleDepartment,
          responsibleEmployee: assetData.responsibleEmployee,
          responsibleIT: assetData.responsibleIT,
          repairHistory: assetData.repairHistory || [],
          ownershipHistory: assetData.ownershipHistory || [],
          responsibleParties: assetData.responsibleParties || []
        };
        
        // In a real implementation, we would post to the API
        // const response = await axiosInstance.post('/assets', newAsset);
        // return response.data;
        
        return newAsset;
      } catch (error) {
        console.error('Error adding asset:', error);
        throw error;
      }
    },
    
    updateAsset: async (assetId: string, assetData: Partial<UserAsset>): Promise<UserAsset> => {
      try {
        console.log('Updating asset:', assetId, assetData);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // Find the existing asset
        const existingAsset = MOCK_ASSETS.find(a => a.id === assetId);
        
        if (!existingAsset) {
          throw new Error('Asset not found');
        }
        
        // Update the asset with the provided data
        const updatedAsset: UserAsset = {
          ...existingAsset,
          ...assetData,
          id: assetId // Ensure the ID doesn't change
        };
        
        // In a real implementation, we would update via the API
        // const response = await axiosInstance.put(`/assets/${assetId}`, updatedAsset);
        // return response.data;
        
        return updatedAsset;
      } catch (error) {
        console.error('Error updating asset:', error);
        throw error;
      }
    },
    
    deleteAsset: async (assetId: string): Promise<{ success: boolean; message: string }> => {
      try {
        console.log('Deleting asset:', assetId);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // In a real implementation, we would delete via the API
        // await axiosInstance.delete(`/assets/${assetId}`);
        
        return { 
          success: true, 
          message: 'Asset deleted successfully' 
        };
      } catch (error) {
        console.error('Error deleting asset:', error);
        throw error;
      }
    },
    
    addRepairRecord: async (assetId: string, repairData: Partial<RepairRecord>): Promise<RepairRecord> => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 400));
        
        const newRepair: RepairRecord = {
          id: `repair-${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`,
          date: repairData.date || new Date().toISOString(),
          description: repairData.description || '',
          cost: repairData.cost,
          technician: repairData.technician,
          status: repairData.status || 'pending',
          parts: repairData.parts || []
        };
        
        // In a real implementation, we would post via the API
        // const response = await axiosInstance.post(`/assets/${assetId}/repairs`, newRepair);
        // return response.data;
        
        return newRepair;
      } catch (error) {
        console.error('Error adding repair record:', error);
        throw error;
      }
    },
    
    addOwnershipRecord: async (assetId: string, ownershipData: Partial<OwnershipRecord>): Promise<OwnershipRecord> => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 400));
        
        const newOwnership: OwnershipRecord = {
          id: `ownership-${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`,
          previousOwner: ownershipData.previousOwner || '',
          previousDepartment: ownershipData.previousDepartment || '',
          transferDate: ownershipData.transferDate || new Date().toISOString(),
          reason: ownershipData.reason,
          documentReference: ownershipData.documentReference
        };
        
        return newOwnership;
      } catch (error) {
        console.error('Error adding ownership record:', error);
        throw error;
      }
    },
    
    addResponsibleParty: async (assetId: string, partyData: Partial<ResponsibleParty>): Promise<ResponsibleParty> => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 400));
        
        const newParty: ResponsibleParty = {
          id: `resp-${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`,
          type: partyData.type || 'employee',
          name: partyData.name || '',
          email: partyData.email,
          phone: partyData.phone,
          startDate: partyData.startDate || new Date().toISOString(),
          endDate: partyData.endDate
        };
        
        return newParty;
      } catch (error) {
        console.error('Error adding responsible party:', error);
        throw error;
      }
    }

    
  }

  
};

// Helper functions
function formatDate(dateString: string): string {
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

function mapImportanceToPriority(importance: string): 'High' | 'Medium' | 'Low' {
  if (!importance) return 'Medium';
  
  const upperImportance = importance?.toUpperCase() || '';
  
  if (upperImportance === 'HIGH') {
    return 'High';
  } else if (upperImportance === 'LOW') {
    return 'Low';
  }
  
  return 'Medium';
}

function mapPriorityToImportance(priority: string): string {
  if (!priority) return 'MEDIUM';
  
  switch (priority) {
    case 'High':
      return 'HIGH';
    case 'Low':
      return 'LOW';
    default:
      return 'MEDIUM';
  }
}

export default apiClient;
