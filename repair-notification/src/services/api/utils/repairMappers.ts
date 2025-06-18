
import { ApiResponse } from '../roleBasedApi';

// Define the repair request interface
export interface RepairRequest {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  asset_id?: number;
  asset_name?: string;
  department_id?: number;
  department_name?: string;
  location?: string;
  assigned_to?: number;
  assignee_name?: string;
  requested_by: number;
  requester_name: string;
  created_at: string;
  updated_at: string;
  completion_date?: string;
  estimated_time?: number;
  approval_status?: string;
  notes?: string;
  images?: string[];
}

export interface ApiResponseWithRepairRequest extends ApiResponse {
  data: RepairRequest | RepairRequest[];
}

// Convert API response to internal format
export const mapApiRepairToInternalFormat = (apiRepair: any): RepairRequest => {
  return {
    id: apiRepair.id,
    title: apiRepair.title || '',
    description: apiRepair.description || '',
    status: apiRepair.status || 'pending',
    priority: apiRepair.priority || 'medium',
    asset_id: apiRepair.asset_id,
    asset_name: apiRepair.asset_name,
    department_id: apiRepair.department_id,
    department_name: apiRepair.department_name,
    location: apiRepair.location,
    assigned_to: apiRepair.assigned_to,
    assignee_name: apiRepair.assignee_name,
    requested_by: apiRepair.requested_by,
    requester_name: apiRepair.requester_name,
    created_at: apiRepair.created_at,
    updated_at: apiRepair.updated_at,
    completion_date: apiRepair.completion_date,
    estimated_time: apiRepair.estimated_time,
    approval_status: apiRepair.approval_status,
    notes: apiRepair.notes,
    images: apiRepair.images || []
  };
};

// Convert internal format to API format for sending
export const mapInternalRepairToApiFormat = (repair: Partial<RepairRequest>): any => {
  return {
    title: repair.title,
    description: repair.description,
    status: repair.status,
    priority: repair.priority,
    asset_id: repair.asset_id,
    department_id: repair.department_id,
    location: repair.location,
    assigned_to: repair.assigned_to,
    notes: repair.notes,
    estimated_time: repair.estimated_time
  };
};
