
import React, { useState } from 'react';
import { RepairRequest } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  CheckCircle2,
  X, 
  Upload,
  FileCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface TechnicianSelfApprovalModalProps {
  repair: RepairRequest;
  onClose: () => void;
  onApprove: (comments: string, references: any[]) => Promise<boolean>;
}

const TechnicianSelfApprovalModal: React.FC<TechnicianSelfApprovalModalProps> = ({
  repair,
  onClose,
  onApprove
}) => {
  const { language } = useLanguage();
  const [comments, setComments] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [references, setReferences] = useState<Array<{
    fileName: string;
    fileType: 'image' | 'document';
    fileUrl: string;
  }>>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newReferences = Array.from(files).map(file => {
      const isImage = file.type.startsWith('image/');
      return {
        fileName: file.name,
        fileType: isImage ? 'image' as const : 'document' as const,
        fileUrl: URL.createObjectURL(file)
      };
    });

    setReferences([...references, ...newReferences]);
  };

  const removeReference = (index: number) => {
    const newReferences = [...references];
    URL.revokeObjectURL(newReferences[index].fileUrl);
    newReferences.splice(index, 1);
    setReferences(newReferences);
  };

  const handleApprove = async () => {
    if (references.length === 0) {
      toast.error(language === 'th' 
        ? 'กรุณาแนบเอกสารหรือรูปภาพประกอบการอนุมัติ' 
        : 'Please attach documents or images for self-approval');
      return;
    }

    if (!comments.trim()) {
      toast.error(language === 'th' 
        ? 'กรุณาระบุรายละเอียดการอนุมัติ' 
        : 'Please provide approval comments');
      return;
    }

    setIsLoading(true);
    try {
      const success = await onApprove(comments, references);
      if (success) {
        onClose();
      }
    } catch (error) {
      console.error('Error in self-approval:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
          <div className="flex items-center">
            <FileCheck className="h-5 w-5 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-blue-800">
              {language === 'th' ? 'อนุมัติด้วยตนเอง (ช่างเทคนิค)' : 'Self Approval (Technician)'}
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
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2 text-gray-800">
              {language === 'th' ? 'ข้อมูลการซ่อม' : 'Repair Information'}
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p><span className="font-medium">{language === 'th' ? 'รหัสการซ่อม:' : 'Repair ID:'}</span> {repair.id}</p>
              <p><span className="font-medium">{language === 'th' ? 'รายละเอียด:' : 'Details:'}</span> {repair.problemDetails || repair.detail}</p>
              <p><span className="font-medium">{language === 'th' ? 'สถานะ:' : 'Status:'}</span> {repair.status}</p>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2 text-gray-800">
              {language === 'th' ? 'คำสั่งการอนุมัติจากหัวหน้างาน' : 'Approval Order from Supervisor'}
            </h3>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder={language === 'th' 
                ? 'กรอกข้อมูลคำสั่งการอนุมัติจากหัวหน้างาน เช่น ได้รับคำสั่งทางโทรศัพท์จากหัวหน้าช่างให้ดำเนินการได้' 
                : 'Enter supervisor approval details, e.g., received approval via phone call from head technician'
              }
            />
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2 text-gray-800 flex items-center">
              <Upload className="h-5 w-5 text-blue-500 mr-2" />
              {language === 'th' ? 'แนบเอกสาร/รูปภาพอ้างอิง (จำเป็น)' : 'Attach Reference Documents/Images (Required)'}
            </h3>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <label className="block w-full">
                <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 hover:border-blue-500 transition-colors cursor-pointer bg-blue-50">
                  <input 
                    type="file" 
                    className="sr-only" 
                    onChange={handleFileUpload}
                    accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                    multiple
                  />
                  <div className="text-center">
                    <Upload className="h-8 w-8 mx-auto text-blue-500 mb-2" />
                    <p className="text-sm text-blue-700">
                      {language === 'th' ? 'คลิกเพื่ออัพโหลดเอกสาร/รูปภาพ' : 'Click to upload documents/images'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {language === 'th' ? 'รูปภาพหรือเอกสารที่แสดงการอนุมัติจากหัวหน้างาน' : 'Images or documents showing approval from supervisor'}
                    </p>
                  </div>
                </div>
              </label>
            </div>
            
            {references.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2 text-gray-700">
                  {language === 'th' ? 'เอกสาร/รูปภาพแนบ:' : 'Attached files:'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {references.map((ref, index) => (
                    <div key={index} className="flex items-center justify-between bg-white p-2 rounded border border-gray-200">
                      <div className="flex items-center overflow-hidden">
                        <div className={`p-2 rounded-lg mr-2 ${ref.fileType === 'image' ? 'bg-blue-100' : 'bg-red-100'}`}>
                          {ref.fileType === 'image' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                          )}
                        </div>
                        <span className="truncate text-sm">{ref.fileName}</span>
                      </div>
                      <button 
                        onClick={() => removeReference(index)}
                        className="ml-2 text-red-600 hover:text-red-800"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <Separator className="my-6" />
          
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="border-gray-300"
            >
              {language === 'th' ? 'ยกเลิก' : 'Cancel'}
            </Button>
            
            <Button
              variant="success"
              onClick={handleApprove}
              disabled={isLoading || references.length === 0 || !comments.trim()}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {language === 'th' ? 'กำลังดำเนินการ...' : 'Processing...'}
                </div>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  {language === 'th' ? 'อนุมัติด้วยตนเอง' : 'Self Approve'}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicianSelfApprovalModal;
