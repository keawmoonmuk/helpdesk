
import { AxiosInstance } from 'axios';
import { UserAsset, RepairRecord, OwnershipRecord, ResponsibleParty } from '@/types';

// Sample data for simulation
const MOCK_ASSETS: UserAsset[] = [
  {
    id: 'asset-001',
    userId: 'user-001',
    assetName: 'Dell Latitude 5420',
    assetCode: 'LAP-001',
    assetLocation: 'HQ Office 3rd Floor',
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
      },
      {
        id: 'repair-003',
        date: '2023-06-22',
        description: 'Keyboard replacement after liquid damage',
        cost: 4500,
        technician: 'Robert Chen',
        status: 'completed',
        parts: ['Keyboard Assembly', 'Keyboard Controller']
      },
      {
        id: 'repair-004',
        date: '2024-02-10',
        description: 'RAM upgrade from 8GB to 16GB',
        cost: 2800,
        technician: 'Mike Johnson',
        status: 'completed',
        parts: ['16GB DDR4 RAM']
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
      },
      {
        id: 'ownership-003',
        previousOwner: 'Charlie Puth',
        previousDepartment: 'Finance',
        transferDate: '2023-11-05',
        reason: 'Role change',
        documentReference: 'TR-20231105-042'
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
      },
      {
        id: 'resp-004',
        type: 'it',
        name: 'Tech Support Team',
        email: 'support@company.com',
        phone: '123-456-7893',
        startDate: '2023-01-01'
      }
    ]
  },
  {
    id: 'asset-002',
    userId: 'user-001',
    assetName: 'HP LaserJet Pro MFP',
    assetCode: 'PRT-001',
    assetLocation: 'HQ Office 2nd Floor',
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
      },
      {
        id: 'repair-004',
        date: '2023-03-15',
        description: 'Toner cartridge replacement',
        cost: 2200,
        technician: 'Lisa Wong',
        status: 'completed',
        parts: ['Black Toner Cartridge', 'Cyan Toner Cartridge']
      },
      {
        id: 'repair-005',
        date: '2024-01-20',
        description: 'Firmware update and calibration',
        cost: 800,
        technician: 'Robert Chen',
        status: 'completed',
        parts: []
      }
    ],
    ownershipHistory: [
      {
        id: 'ownership-004',
        previousOwner: 'Marketing Department',
        previousDepartment: 'Marketing',
        transferDate: '2022-05-18',
        reason: 'Department restructuring'
      },
      {
        id: 'ownership-005',
        previousOwner: 'Admin Office',
        previousDepartment: 'Administration',
        transferDate: '2023-09-12',
        reason: 'Space optimization',
        documentReference: 'TR-20230912-078'
      }
    ],
    responsibleParties: [
      {
        id: 'resp-005',
        type: 'department',
        name: 'Office Management',
        email: 'office@company.com',
        phone: '123-456-7894',
        startDate: '2021-11-05'
      },
      {
        id: 'resp-006',
        type: 'employee',
        name: 'David Miller',
        email: 'david.miller@company.com',
        phone: '123-456-7895',
        startDate: '2023-09-12'
      }
    ]
  },
  {
    id: 'asset-003',
    userId: 'user-001',
    assetName: 'MacBook Pro 14"',
    assetCode: 'LAP-002',
    assetLocation: 'Design Studio Room 101',
    serialNumber: 'MBP14M1X89745',
    assetType: 'computer',
    purchaseDate: '2023-05-10',
    expirationDate: '2026-05-10',
    model: 'MacBook Pro 14-inch M1 Pro',
    manufacturer: 'Apple',
    assetCategory: 'hardware',
    status: 'active',
    responsibleDepartment: 'Design',
    responsibleEmployee: 'Emma Watson',
    repairHistory: [],
    ownershipHistory: [],
    responsibleParties: [
      {
        id: 'resp-007',
        type: 'department',
        name: 'Design Department',
        email: 'design@company.com',
        phone: '123-456-7896',
        startDate: '2023-05-10'
      },
      {
        id: 'resp-008',
        type: 'employee',
        name: 'Emma Watson',
        email: 'emma.watson@company.com',
        phone: '123-456-7897',
        startDate: '2023-05-10'
      }
    ]
  },
  {
    id: 'asset-004',
    userId: 'user-001',
    assetName: 'CISCO Switch 48-Port',
    assetCode: 'NET-001',
    assetLocation: 'Server Room B',
    serialNumber: 'CSCSW48P1234',
    assetType: 'server',
    purchaseDate: '2022-01-20',
    expirationDate: '2027-01-20',
    model: 'Catalyst 9300 48-port',
    manufacturer: 'Cisco',
    assetCategory: 'network',
    status: 'active',
    repairHistory: [
      {
        id: 'repair-006',
        date: '2023-08-15',
        description: 'Fan replacement',
        cost: 5500,
        technician: 'Network Support Team',
        status: 'completed',
        parts: ['Cooling Fan Assembly']
      }
    ],
    ownershipHistory: [],
    responsibleParties: [
      {
        id: 'resp-009',
        type: 'department',
        name: 'Network Operations',
        email: 'netops@company.com',
        phone: '123-456-7898',
        startDate: '2022-01-20'
      },
      {
        id: 'resp-010',
        type: 'it',
        name: 'Network Team',
        email: 'network@company.com',
        phone: '123-456-7899',
        startDate: '2022-01-20'
      }
    ]
  }
];

const assetApi = (axiosInstance: AxiosInstance) => {
  return {
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
  };
};

export default assetApi;
