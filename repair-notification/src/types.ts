export interface User {
  id: number | string;
  username: string;
  name: string;
  email: string;
  role: 'admin' | 'technician' | 'user';
  department?: string;
  status?: string;
  joiningDate?: string;
}

export interface Department {
  department_id: number;
  department_name: string;
}

export interface Asset {
  assetName: string;
  assetCode?: string;
  assetSerial?: string;
  assetLocation?: string;
}

export interface RepairRecord {
  id: string;
  date: string;
  description: string;
  cost?: number;
  technician?: string;
  status?: 'completed' | 'in-progress' | 'pending';
  parts?: string[];
}

export interface OwnershipRecord {
  id: string;
  previousOwner: string;
  previousDepartment: string;
  transferDate: string;
  reason?: string;
  documentReference?: string;
}

export interface ResponsibleParty {
  id: string;
  type: 'department' | 'employee' | 'it';
  name: string;
  email?: string;
  phone?: string;
  startDate: string;
  endDate?: string;
  role?: 'asset-manager' | 'asset-staff' | 'it-manager';
}

export interface UserAsset {
  id: string;
  userId: string;
  assetName: string;
  assetCode: string;
  assetLocation: string;
  serialNumber: string;
  assetType: 'computer' | 'printer' | 'server' | 'other';
  purchaseDate?: string;
  expirationDate?: string;
  model?: string;
  manufacturer?: string;
  assetCategory?: 'hardware' | 'software' | 'network' | 'other';
  softwareType?: 'operating-system' | 'office' | 'design' | 'security' | 'development' | 'other';
  licenseKey?: string;
  licenseSeats?: number;
  maintenanceExpiryDate?: string;
  warrantyExpiryDate?: string;
  notes?: string;
  status?: 'active' | 'expired' | 'maintenance' | 'decommissioned';
  // Previous ownership and responsibility fields
  previousOwner?: string;
  previousDepartment?: string;
  acquisitionDate?: string;
  responsibleDepartment?: string;
  responsibleEmployee?: string;
  responsibleIT?: string;
  repairHistory?: RepairRecord[];
  ownershipHistory?: OwnershipRecord[];
  responsibleParties?: ResponsibleParty[];
}

//  interface สำหรับบทบาทการจัดการสินทรัพย์
export interface AssetManagementRole {
  id: string;
  userId: string | number;
  userName: string;
  userEmail: string;
  roleName: 'asset-manager' | 'asset-staff' | 'it-manager';
  department: string;
  assignedDate: string;
  expiryDate?: string;
  permissions: string[];
  active: boolean;
}

export interface RepairCreator {
  userId: number;
  fullName: string;
  email: string;
  department: Department;
}

export interface RepairDocument {
  id: string;
  fileName: string;
  fileType: 'image' | 'document';  
  fileUrl: string;
  uploadDate: string;
  uploadedBy: string;
}

export interface RepairApproval {
  status: 'pending' | 'approved' | 'rejected';
  approvalDate?: string;
  approvedBy?: string;
  approverRole?: string;
  comments?: string;
}

export interface RepairRequest {
  id: string;
  problemDetails: string;
  reporter: string;
  reporterId?: number;
  reporterFullName?: string;
  department?: string;
  building?: string;
  floor?: string;
  technician: string;
  status: string;
  dateReported: string;
  priority: 'High' | 'Medium' | 'Low';
  assetName?: string;
  assetCode?: string;
  assetSerial?: string;
  assetLocation?: string;
  checkInDate?: string;
  checkOutDate?: string;
  lastUpdated?: string;
  // New fields from the API
  detail?: string;
  importance?: string;
  create_at?: string;
  creator?: RepairCreator;
  asset?: Asset;
  inspected_by?: string;
  departmentId?: number | string;
  // New fields for approval and documents
  approval?: RepairApproval;
  documents?: RepairDocument[];
}

export interface DashboardStats {
  activeRepairs: number;
  completedToday: number;
  pending: number;
  urgent: number;
}

export interface EditRepairFormData {
  id: string;
  reporterName: string;
  department: string;
  building: string;
  floor: string;
  assetName: string;
  assetCode: string;
  assetLocation: string;
  repairDetails: string;
  priority: 'High' | 'Medium' | 'Low';
  status: string;
}

export interface CreateRepairData {
  departmentId: string;
  building: string;
  floor: string;
  assetName: string;
  assetSerial?: string;
  assetCode?: string;
  assetLocation: string;
  detailRepair: string;
  importance: string;
  status: string;
  images?: string[];
}

export interface EditRepairData {
  departmentId: string;
  building: string;
  floor: string;
  assetName: string;
  assetSerial?: string;
  assetCode?: string;
  assetLocation: string;
  detailRepair: string;
  importance: string;
  status: string;
  images?: string[];
}
