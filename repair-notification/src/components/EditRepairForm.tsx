
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { X } from 'lucide-react';
import { RepairRequest } from '@/types';
import Swal from 'sweetalert2';
import apiClient from '@/services/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
//import { departmentOptions, departmentIdMap } from '@/schemas/repairRequestSchema';

interface EditRepairFormProps {
  repairRequest: RepairRequest | null;
  onClose: () => void;
  onSuccess: () => void;
}

const EditRepairForm: React.FC<EditRepairFormProps> = ({ repairRequest, onClose, onSuccess }) => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    id: repairRequest?.id || '',
    reporterName: repairRequest?.reporterFullName || repairRequest?.reporter || '',
    department: repairRequest?.department || '',
    building: repairRequest?.building || '',
    floor: repairRequest?.floor || '',
    assetName: repairRequest?.assetName || '',
    assetCode: repairRequest?.assetCode || '',
    assetSerial: repairRequest?.asset?.assetSerial || '',
    assetLocation: repairRequest?.assetLocation || '',
    repairDetails: repairRequest?.problemDetails || repairRequest?.detail || '',
    priority: repairRequest?.priority || 'Medium' as 'High' | 'Medium' | 'Low',
    status: repairRequest?.status || 'Pending'
  });

  //add department
  const [departments, setDepartments]= useState<{value: string, label: string}[]>([]); // เก็บข้อมูลแผนก
  
  const fetchDepartments = async () => {
    try {
      const departmentData = await apiClient.getDepartments(); // เรียก API เพื่อดึงข้อมูลแผนก
      setDepartments(departmentData);  // เก็บข้อมูลแผนกใน state
    } catch (error) {
      console.error('Error fetching departments:', error);
      Swal.fire({
        icon: 'error',
        title: t('common.error'),
        text: language === 'th' ? 'เกิดข้อผิดพลาดในการดึงข้อมูลแผนก' : 'Error fetching departments'
      });
    }
  }
  
  useEffect(() => {
    fetchDepartments(); // เรียกใช้ฟังก์ชันเมื่อ component ถูก mount
  }, []);
  
  useEffect(() => {
    if (repairRequest) {

      const departmentId = departments.find(dept => dept.label === repairRequest.department)?.value || ''; // ดึงค่า departmentId จาก repairRequest

      setFormData({
        id: repairRequest.id || '',
        reporterName: repairRequest.reporterFullName || repairRequest.reporter || '',
        department: departmentId,
        building: repairRequest.building || '',
        floor: repairRequest.floor || '',
        assetName: repairRequest.assetName || repairRequest.asset?.assetName || '',
        assetCode: repairRequest.assetCode || repairRequest.asset?.assetCode || '',
        assetSerial: repairRequest.asset?.assetSerial || '',
        assetLocation: repairRequest.assetLocation || repairRequest.asset?.assetLocation || '',
        repairDetails: repairRequest.problemDetails || repairRequest.detail || '',
        priority: repairRequest.priority || 'Medium',
        status: repairRequest.status || 'Pending'
      });
    }
  }, [repairRequest, departments]);
  
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDepartmentChange = (value: string) => {
    setFormData(prev => ({ ...prev, department: value }));
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      
      const selectedFiles = filesArray.slice(0, 7 - images.length);
      
      const newImagePreviewUrls = selectedFiles.map(file => URL.createObjectURL(file));
      
      setImages(prev => [...prev, ...selectedFiles]);
      setImagePreviewUrls(prev => [...prev, ...newImagePreviewUrls]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    const newImagePreviewUrls = [...imagePreviewUrls];
    
    URL.revokeObjectURL(newImagePreviewUrls[index]);
    
    newImages.splice(index, 1);
    newImagePreviewUrls.splice(index, 1);
    
    setImages(newImages);
    setImagePreviewUrls(newImagePreviewUrls);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!repairRequest) {
      Swal.fire({
        icon: 'error',
        title: t('common.error'),
        text: 'No repair request data available to update'
      });
      return;
    }
    
    try {
      setLoading(true);
      
      //const departmentId = departmentIdMap[formData.department] || "1";
      
      // Format data according to API requirements
      const updatedRequest = {
        departmentId: formData.department,
        building: formData.building,
        floor: formData.floor,
        assetName: formData.assetName,
        assetSerial: formData.assetSerial,
        assetCode: formData.assetCode,
        assetLocation: formData.assetLocation,
        detailRepair: formData.repairDetails,
        importance: formData.priority.toUpperCase(),
        status: formData.status.toUpperCase(),
        images: imagePreviewUrls
      };
      
      console.log('Submitting updated repair request:', updatedRequest);
      
      await apiClient.updateRepairRequest(formData.id, updatedRequest);  // เรียก API เพื่ออัปเดตการแจ้งซ่อม
      
      Swal.fire({
        icon: 'success',
        title: t('common.success'),
        text: language === 'th' ? 'อัปเดตการแจ้งซ่อมเรียบร้อยแล้ว' : 'Repair request updated successfully',
        timer: 2000,
        showConfirmButton: false
      });
      
      onSuccess();  // เรียก callback เพื่อรีเฟรชข้อมูลในหน้า Dashboard
    } catch (error) {
      const errorMessage = error.message || (language === 'th' ? 'เกิดข้อผิดพลาดในการอัปเดตการแจ้งซ่อม' : 'Error updating repair request');
      Swal.fire({
        icon: 'error',
        title: t('common.error'),
        text: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  if (!repairRequest) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b bg-blue-50">
          <h2 className="text-xl font-semibold text-blue-800">
            {t('แก้ไขการแจ้งซ่อม') || (language === 'th' ? 'แก้ไขการแจ้งซ่อม' : 'Edit Repair Request')}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>
          
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'th' ? 'ชื่อผู้แจ้ง' : t('addRepair.reporterName') || 'Reporter Name'}
              </label>
              <Input
                type="text"
                id="reporterName"
                name="reporterName"
                className="w-full focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                value={formData.reporterName}
                onChange={handleChange}
                placeholder={language === 'th' ? 'กรอกชื่อผู้แจ้ง' : 'Enter reporter name'}
                required
              />
            </div>
            {/* ชื่อแผนก   */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'th' ? 'แผนก' : t('addRepair.department') || 'Department'}
              </label>
              <Select 
                value={formData.department}
                onValueChange={handleDepartmentChange}
              >
                <SelectTrigger className="w-full h-10">
                  <SelectValue placeholder={language === 'th' ? 'เลือกแผนก' : "Select department"} />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.value} value={dept.value}>
                      {dept.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'th' ? 'อาคาร' : t('addRepair.building') || 'Building'}
              </label>
              <Input
                type="text"
                id="building"
                name="building"
                className="w-full focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                value={formData.building}
                onChange={handleChange}
                placeholder={language === 'th' ? 'เช่น อาคาร 1' : 'e.g. Building 1'}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'th' ? 'ชั้น' : t('addRepair.floor') || 'Floor'}
              </label>
              <Input
                type="text"
                id="floor"
                name="floor"
                className="w-full focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                value={formData.floor}
                onChange={handleChange}
                placeholder={language === 'th' ? 'เช่น ชั้น 2' : 'e.g. Floor 2'}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'th' ? 'ชื่อทรัพย์สิน' : t('addRepair.assetName') || 'Asset Name'}
              </label>
              <Input
                type="text"
                id="assetName"
                name="assetName"
                className="w-full focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                value={formData.assetName}
                onChange={handleChange}
                placeholder={language === 'th' ? 'เช่น คอมพิวเตอร์' : 'e.g. Computer'}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'th' ? 'เลขที่ทรัพย์สิน' : t('addRepair.assetCode') || 'Asset Code'}
              </label>
              <Input
                type="text"
                id="assetCode"
                name="assetCode"
                className="w-full focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                value={formData.assetCode}
                onChange={handleChange}
                placeholder={language === 'th' ? 'เช่น PC-001' : 'e.g. PC-001'}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'th' ? 'หมายเลขซีเรียล' : 'Serial Number'}
              </label>
              <Input
                type="text"
                id="assetSerial"
                name="assetSerial"
                className="w-full focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                value={formData.assetSerial}
                onChange={handleChange}
                placeholder={language === 'th' ? 'เช่น A-123' : 'e.g. A-123'}
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'th' ? 'ที่อยู่ทรัพย์สิน' : t('addRepair.assetLocation') || 'Asset Location'}
            </label>
            <Input
              type="text"
              id="assetLocation"
              name="assetLocation"
              className="w-full focus:ring-blue-500 focus:border-blue-500 border-gray-300"
              value={formData.assetLocation}
              onChange={handleChange}
              placeholder={language === 'th' ? 'เช่น ห้องประชุม 1' : 'e.g. Meeting Room 1'}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'th' ? 'ความสำคัญ' : t('addRepair.priority') || 'Priority'}
              </label>
              <select
                id="priority"
                name="priority"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-10"
                value={formData.priority}
                onChange={handleChange}
                required
              >
                <option value="Low">{language === 'th' ? 'ต่ำ' : t('priority.low') || 'Low'}</option>
                <option value="Medium">{language === 'th' ? 'ปานกลาง' : t('priority.medium') || 'Medium'}</option>
                <option value="High">{language === 'th' ? 'สูง' : t('priority.high') || 'High'}</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'th' ? 'สถานะ' : t('addRepair.status') || 'Status'}
              </label>
              <select
                id="status"
                name="status"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-10"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="PENDING">{language === 'th' ? 'รอดำเนินการ' : t('status.pending') || 'Pending'}</option>
                <option value="IN PROGRESS">{language === 'th' ? 'กำลังดำเนินการ' : t('status.inProgress') || 'In Progress'}</option>
                <option value="COMPLETED">{language === 'th' ? 'เสร็จสิ้น' : t('status.completed') || 'Completed'}</option>
                <option value="WAITING FOR ACTION">{language === 'th' ? 'รอดำเนินการ' : 'Waiting for Action'}</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'th' ? 'รายละเอียดการซ่อม' : t('addRepair.repairDetails') || 'Repair Details'}
            </label>
            <textarea
              id="repairDetails"
              name="repairDetails"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.repairDetails}
              onChange={handleChange}
              placeholder={language === 'th' ? 'กรุณาระบุรายละเอียดการซ่อมที่ต้องการ' : 'Please describe the repair details'}
              required
            ></textarea>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'th' ? 'อัพโหลดรูปภาพ (สูงสุด 7 รูป)' : 'Upload Images (maximum 7 images)'}
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-blue-300 border-dashed rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-10 h-10 mb-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                  <p className="mb-2 text-sm text-gray-700">
                    <span className="font-semibold">
                      {language === 'th' ? 'คลิกเพื่ออัพโหลด' : 'Click to upload'}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500">
                    {language === 'th' ? 'PNG, JPG, GIF ไม่เกิน 5MB' : 'PNG, JPG, GIF up to 5MB'}
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  disabled={images.length >= 7}
                />
              </label>
            </div>
            
            {imagePreviewUrls.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {imagePreviewUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="mt-6 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-red-500 text-red-500 hover:bg-red-50"
            >
              {language === 'th' ? 'ยกเลิก' : t('addRepair.cancel') || 'Cancel'}
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {language === 'th' ? 'กำลังอัปเดต...' : t('editRepair.processing') || 'Processing...'}
                </span>
              ) : (
                language === 'th' ? 'อัปเดต' : t('editRepair.update') || 'Update'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRepairForm;
