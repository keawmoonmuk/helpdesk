
import React, { useState } from 'react';
import { X, CheckCircle, XCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { RepairRequest } from '@/types';

interface SupervisorApprovalModalProps {
  repair: RepairRequest;
  onClose: () => void;
  onApprove: (comments: string) => void;
  onReject: (comments: string) => void;
}

const SupervisorApprovalModal: React.FC<SupervisorApprovalModalProps> = ({
  repair,
  onClose,
  onApprove,
  onReject,
}) => {
  const { language } = useLanguage();
  const [comments, setComments] = useState('');
  const [processing, setProcessing] = useState(false);
  const [decision, setDecision] = useState<'approve' | 'reject' | null>(null);

  const handleSubmit = async () => {
    if (!decision) return;
    
    setProcessing(true);
    
    try {
      if (decision === 'approve') {
        await onApprove(comments);
      } else {
        await onReject(comments);
      }
      
      toast.success(
        language === 'th' 
          ? decision === 'approve' 
            ? 'การอนุมัติสำเร็จ' 
            : 'การปฏิเสธสำเร็จ' 
          : decision === 'approve'
            ? 'Successfully approved'
            : 'Successfully rejected'
      );
      
      onClose();
    } catch (error) {
      toast.error(
        language === 'th'
          ? 'เกิดข้อผิดพลาดในการดำเนินการ'
          : 'Error processing your request'
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">
            {language === 'th' ? 'การอนุมัติของหัวหน้างาน' : 'Supervisor Approval'}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-4">
          <div className="mb-4">
            <div className="flex justify-between mb-2 text-sm">
              <span className="text-gray-500">{language === 'th' ? 'รหัสคำขอ' : 'Request ID'}</span>
              <span className="font-medium">{repair.id}</span>
            </div>
            <div className="flex justify-between mb-2 text-sm">
              <span className="text-gray-500">{language === 'th' ? 'รายละเอียด' : 'Details'}</span>
              <span className="font-medium truncate max-w-[200px]">
                {repair.problemDetails || repair.detail || '-'}
              </span>
            </div>
            <div className="flex justify-between mb-2 text-sm">
              <span className="text-gray-500">{language === 'th' ? 'ช่างเทคนิค' : 'Technician'}</span>
              <span className="font-medium">{repair.technician || '-'}</span>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'th' ? 'ความคิดเห็น' : 'Comments'}
            </label>
            <Textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder={language === 'th' ? 'เพิ่มความคิดเห็นหรือหมายเหตุ...' : 'Add any comments or notes...'}
              className="w-full"
              rows={4}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3 mt-6">
            <Button
              variant="outline"
              className="border-red-500 text-red-600 hover:bg-red-50 flex items-center justify-center"
              onClick={() => setDecision('reject')}
              disabled={processing || decision === 'approve'}
            >
              <XCircle className="h-4 w-4 mr-2" />
              {language === 'th' ? 'ไม่อนุมัติ' : 'Reject'}
            </Button>
            
            <Button
              className="bg-green-600 hover:bg-green-700 text-white flex items-center justify-center"
              onClick={() => setDecision('approve')}
              disabled={processing || decision === 'reject'}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {language === 'th' ? 'อนุมัติ' : 'Approve'}
            </Button>
          </div>
          
          {decision && (
            <div className="mt-4">
              <Button
                className="w-full flex items-center justify-center"
                onClick={handleSubmit}
                disabled={processing}
              >
                {processing ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {language === 'th' ? 'กำลังประมวลผล...' : 'Processing...'}
                  </span>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    {language === 'th' ? 'ยืนยัน' : 'Submit'}
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupervisorApprovalModal;
