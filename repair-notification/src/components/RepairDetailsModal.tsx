
import React, { useState } from 'react';
import { RepairDocument, RepairRequest } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Building, 
  Calendar, 
  Clock, 
  MapPin, 
  Package, 
  User, 
  X,
  AlertTriangle,
  FileText,
  Wrench,
  Image,
  FileCheck,
  Upload,
  Trash2,
  CheckCircle2,
  XCircle,
  ClockIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import RepairActions from './RepairActions';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface RepairDetailsModalProps {
  repair: RepairRequest | null;
  onClose: () => void;
  onActionComplete?: () => void;
  readOnly?: boolean; 
}

const RepairDetailsModal: React.FC<RepairDetailsModalProps> = ({ 
  repair, 
  onClose,
  onActionComplete,
  readOnly
}) => {
  const { language } = useLanguage();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadType, setUploadType] = useState<'image' | 'document'>('image');
  const [isUploading, setIsUploading] = useState(false);
  
  if (!repair) {
    return null;
  }
  
  // Demo documents if none exist in the repair
  const documents = repair.documents || [];
  
  // Demo approval if none exists
  const approval = repair.approval || {
    status: 'pending',
    approvalDate: '',
    approvedBy: '',
    approverRole: ''
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800'; 
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
      case 'เสร็จสิ้น':
        return 'bg-green-500 text-white';
      case 'In Progress':
      case 'กำลังดำเนินการ':
        return 'bg-yellow-500 text-white';
      case 'Pending':
      case 'รอดำเนินการ':
      case 'Waiting for action':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getApprovalStatusBadge = () => {
    switch (approval.status) {
      case 'approved':
        return (
          <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1.5 rounded-full">
            <CheckCircle2 className="h-4 w-4" />
            <span>{language === 'th' ? 'อนุมัติแล้ว' : 'Approved'}</span>
          </div>
        );
      case 'rejected':
        return (
          <div className="flex items-center space-x-2 bg-red-100 text-red-800 px-3 py-1.5 rounded-full">
            <XCircle className="h-4 w-4" />
            <span>{language === 'th' ? 'ไม่อนุมัติ' : 'Rejected'}</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center space-x-2 bg-yellow-100 text-yellow-800 px-3 py-1.5 rounded-full">
            <ClockIcon className="h-4 w-4" />
            <span>{language === 'th' ? 'รอการอนุมัติ' : 'Pending'}</span>
          </div>
        );
    }
  };

  // Safe access to nested properties
  const reporterName = repair.reporterFullName || repair.reporter || 
                       repair.creator?.fullName || '-';
  const departmentName = repair.department || 
                        (repair.creator?.department?.department_name) || '-';
  const problemDetails = repair.problemDetails || repair.detail || '-';
  const assetName = repair.assetName || (repair.asset?.assetName) || '-';
  const assetCode = repair.assetCode || (repair.asset?.assetCode) || '-';
  const assetLocation = repair.assetLocation || (repair.asset?.assetLocation) || '-';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error(language === 'th' ? 'กรุณาเลือกไฟล์' : 'Please select a file');
      return;
    }

    setIsUploading(true);
    
    try {
      // In a real app, this would upload to a server
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful upload
      const newDocument: RepairDocument = {
        id: Date.now().toString(),
        fileName: selectedFile.name,
        fileType: uploadType,
        fileUrl: URL.createObjectURL(selectedFile), // In real app, this would be a server URL
        uploadDate: new Date().toISOString().split('T')[0],
        uploadedBy: 'Current User'
      };
      
      // In a real app, we would update the server data
      toast.success(language === 'th' ? 'อัปโหลดไฟล์เสร็จสิ้น' : 'File uploaded successfully');
      
      if (onActionComplete) {
        onActionComplete();
      }
      
      setSelectedFile(null);
    } catch (error) {
      toast.error(language === 'th' ? 'เกิดข้อผิดพลาดในการอัปโหลด' : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    try {
      // In a real app, this would delete from a server
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success(language === 'th' ? 'ลบไฟล์เรียบร้อยแล้ว' : 'File deleted successfully');
      
      if (onActionComplete) {
        onActionComplete();
      }
    } catch (error) {
      toast.error(language === 'th' ? 'เกิดข้อผิดพลาดในการลบไฟล์' : 'Delete failed');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
          <div className="flex items-center">
            <FileText className="h-5 w-5 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-blue-800">
              {language === 'th' ? 'รายละเอียดการซ่อม' : 'Repair Details'} - {repair.id}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6">
          {/* Status, Priority, and Approval Status */}
          <div className="flex flex-wrap justify-between items-center mb-6">
            <div className="flex flex-wrap gap-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(repair.status)}`}>
                {repair.status}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(repair.priority)}`}>
                {language === 'th' 
                  ? repair.priority === 'High' ? 'สูง' : repair.priority === 'Medium' ? 'ปานกลาง' : 'ต่ำ'
                  : repair.priority
                }
              </span>
              {/* Approval Status */}
              {getApprovalStatusBadge()}
            </div>
            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-1" />
              {repair.dateReported || repair.create_at || '-'}
            </div>
          </div>
          
          {/* Problem Details */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2 text-gray-800">
              {language === 'th' ? 'รายละเอียดปัญหา' : 'Problem Details'}
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-gray-700">{problemDetails}</p>
            </div>
          </div>
          
          {/* Reporter and Asset Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-medium mb-3 text-gray-800">
                {language === 'th' ? 'ข้อมูลผู้แจ้ง' : 'Reporter Information'}
              </h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <User className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium">{reporterName}</p>
                    <p className="text-sm text-gray-500">{departmentName}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Building className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                  <div>
                    <p className="text-gray-700">
                      {repair.building || '-'} / {repair.floor || '-'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3 text-gray-800">
                {language === 'th' ? 'ข้อมูลสินทรัพย์' : 'Asset Information'}
              </h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <Package className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium">{assetName}</p>
                    <p className="text-sm text-gray-500">{assetCode}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                  <div>
                    <p className="text-gray-700">{assetLocation}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Approval Information */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3 text-gray-800">
              {language === 'th' ? 'ข้อมูลการอนุมัติ' : 'Approval Information'}
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              {approval.status !== 'pending' ? (
                <div className="space-y-3">
                  <div className="flex items-start">
                    <User className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">
                        {language === 'th' ? 'อนุมัติโดย' : 'Approved by'}
                      </p>
                      <p className="font-medium">{approval.approvedBy || 'หัวหน้าช่างเทคนิค'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">
                        {language === 'th' ? 'วันที่อนุมัติ' : 'Approval date'}
                      </p>
                      <p className="font-medium">{approval.approvalDate || '2025-03-30'}</p>
                    </div>
                  </div>
                  
                  {approval.comments && (
                    <div className="flex items-start">
                      <FileText className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">
                          {language === 'th' ? 'หมายเหตุ' : 'Comments'}
                        </p>
                        <p>{approval.comments}</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <p className="text-yellow-700">
                    {language === 'th' ? 'กำลังรอการอนุมัติจากหัวหน้างาน' : 'Waiting for supervisor approval'}
                  </p>
                  
                  <Button 
                    variant="outline"
                    className="text-blue-600 border-blue-600 hover:bg-blue-50"
                    onClick={() => {
                      toast.success(
                        language === 'th' ? 'ส่งเตือนหัวหน้างานเรียบร้อย' : 'Supervisor notification sent successfully'
                      );
                    }}
                  >
                    {language === 'th' ? 'แจ้งเตือนอีกครั้ง' : 'Send reminder'}
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {/* Check-in/Check-out Info */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2 text-gray-800">
              {language === 'th' ? 'ข้อมูลการตรวจสอบ' : 'Check-in/Check-out Information'}
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-green-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">
                      {language === 'th' ? 'เช็คอิน' : 'Check-in'}
                    </p>
                    <p className="font-medium">
                      {repair.checkInDate || (language === 'th' ? 'ยังไม่มีข้อมูล' : 'No data')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-red-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">
                      {language === 'th' ? 'เช็คเอาท์' : 'Check-out'}
                    </p>
                    <p className="font-medium">
                      {repair.checkOutDate || (language === 'th' ? 'ยังไม่มีข้อมูล' : 'No data')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Documents and Images */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3 text-gray-800 flex items-center">
              <FileCheck className="h-5 w-5 text-blue-500 mr-2" />
              {language === 'th' ? 'รูปภาพและเอกสาร' : 'Images & Documents'}
            </h3>
            
            {/* File upload section */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
                <div className="w-full md:flex-1">
                  <div className="flex space-x-3 mb-2">
                    <button 
                      className={`px-3 py-1 text-sm rounded-full ${uploadType === 'image' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                      onClick={() => setUploadType('image')}
                    >
                      {language === 'th' ? 'รูปภาพ' : 'Image'}
                    </button>
                    <button 
                      className={`px-3 py-1 text-sm rounded-full ${uploadType === 'document' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                      onClick={() => setUploadType('document')}
                    >
                      {language === 'th' ? 'เอกสาร' : 'Document'}
                    </button>
                  </div>
                  <label className="block">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-colors cursor-pointer">
                      <input 
                        type="file" 
                        className="sr-only" 
                        onChange={handleFileChange}
                        accept={uploadType === 'image' ? 'image/*' : '.pdf,.doc,.docx,.xls,.xlsx,.txt'} 
                      />
                      <div className="text-center">
                        <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">
                          {selectedFile ? selectedFile.name : (
                            language === 'th' ? 
                            'คลิกหรือลากไฟล์มาที่นี่' : 
                            'Click or drag file to upload'
                          )}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {uploadType === 'image' ? 
                            (language === 'th' ? 'รองรับไฟล์ภาพทุกประเภท' : 'Supports all image formats') : 
                            (language === 'th' ? 'รองรับไฟล์ PDF, Word และ Excel' : 'Supports PDF, Word and Excel')
                          }
                        </p>
                      </div>
                    </div>
                  </label>
                </div>
                <Button 
                  onClick={handleUpload} 
                  disabled={!selectedFile || isUploading}
                  className="w-full md:w-auto"
                >
                  {isUploading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {language === 'th' ? 'กำลังอัปโหลด...' : 'Uploading...'}
                    </div>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      {language === 'th' ? 'อัปโหลดไฟล์' : 'Upload File'}
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Document list */}
            <div className="bg-white rounded-lg border border-gray-200">
              {documents.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <Image className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <p>{language === 'th' ? 'ยังไม่มีเอกสารหรือรูปภาพ' : 'No documents or images yet'}</p>
                  <p className="text-sm mt-1">
                    {language === 'th' ? 'อัปโหลดรูปภาพหรือเอกสารเพื่อแสดงที่นี่' : 'Upload images or documents to show here'}
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {/* For demo, we'll show some mock documents */}
                  <li className="p-3 hover:bg-gray-50 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Image className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium">repair-photo-1.jpg</p>
                        <p className="text-xs text-gray-500">Uploaded on 2025-03-30</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button onClick={() => handleDeleteDocument('1')} className="text-red-600 hover:text-red-800">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </li>
                  <li className="p-3 hover:bg-gray-50 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-red-100 p-2 rounded-lg">
                        <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium">repair-report.pdf</p>
                        <p className="text-xs text-gray-500">Uploaded on 2025-03-29</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button onClick={() => handleDeleteDocument('2')} className="text-red-600 hover:text-red-800">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </li>
                </ul>
              )}
            </div>
          </div>
          
          <Separator className="my-6" />
          
          {/* Technician Actions */}
          <div className="pt-2">
            <h3 className="text-lg font-medium mb-4 text-gray-800 flex items-center">
              <Wrench className="h-5 w-5 text-blue-500 mr-2" />
              {language === 'th' ? 'การดำเนินการ' : 'Actions'}
            </h3>
            
            <RepairActions 
              repairId={repair.id} 
              onActionComplete={onActionComplete}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepairDetailsModal;
