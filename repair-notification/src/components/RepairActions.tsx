import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  ThumbsUp, 
  ThumbsDown,
  FileCheck,
  UserCog,
  Package,
  Send,
  PlusCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { useRepairRequests } from '@/hooks/useRepairRequests';
import TechnicianSelfApprovalModal from './TechnicianSelfApprovalModal';

interface RepairActionsProps {
  repairId: string;
  onActionComplete?: () => void;
}

const RepairActions: React.FC<RepairActionsProps> = ({ 
  repairId, 
  onActionComplete
}) => {
  const { language } = useLanguage();
  const { 
    repairRequests, 
    handleUpdateStatus, 
    handleSelfApproveRepairRequest,
  } = useRepairRequests();
  
  const [showSelfApprovalModal, setShowSelfApprovalModal] = useState(false);
  const [showSelfProcessModal, setShowSelfProcessModal] = useState(false);
  
  const repair = repairRequests.find(r => r.id === repairId);
  if (!repair) return null;
  
  const isCompleted = repair.status === 'เสร็จสิ้น' || repair.status.toLowerCase() === 'completed';
  const isInProgress = repair.status === 'กำลังดำเนินการ' || repair.status.toLowerCase().includes('progress');
  const isPending = repair.status === 'รอดำเนินการ' || repair.status.toLowerCase() === 'pending';
  
  const needsApproval = !repair.approval || repair.approval?.status === 'pending';
  
  const handleMarkInProgress = async () => {
    await handleUpdateStatus(repairId, 'กำลังดำเนินการ');
    if (onActionComplete) onActionComplete();
  };
  
  const handleMarkCompleted = async () => {
    await handleUpdateStatus(repairId, 'เสร็จสิ้น');
    if (onActionComplete) onActionComplete();
  };
  
  const handleSelfApprove = async (comments: string, references: any[]) => {
    await handleSelfApproveRepairRequest(repairId, comments);
    
    if (onActionComplete) {
      onActionComplete();
    }
    
    return true; // Return success status
  };

  const handleSelfProcess = () => {
    toast.success(
      language === 'th' 
        ? 'ดำเนินการด้วยตนเองเรียบร้อยแล้ว' 
        : 'Self-processing completed successfully'
    );
    
    if (onActionComplete) onActionComplete();
  };
  
  return (
    <div>
      {language === 'th' && (
        <div className="mb-4">
          <h3 className="flex items-center text-lg font-medium text-blue-600 mb-3">
            <span className="inline-block mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
              </svg>
            </span>
            การดำเนินการ
          </h3>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline"
              className="bg-white border-blue-500 text-blue-600 hover:bg-blue-50"
              onClick={handleSelfProcess}
            >
              <Package className="h-4 w-4 mr-2" />
              ขอชิ้นส่วนซ่อมภายใน
            </Button>
            
            <Button 
              variant="outline"
              className="bg-white border-orange-500 text-orange-600 hover:bg-orange-50"
              onClick={() => {
                toast.info('ส่งการแจ้งเตือนไปยังหัวหน้าช่างแล้ว');
                if (onActionComplete) onActionComplete();
              }}
            >
              <Send className="h-4 w-4 mr-2" />
              สั่งซื้อภายนอก
            </Button>
            
            <Button 
              variant="outline"
              className="bg-white border-red-500 text-red-600 hover:bg-red-50"
              onClick={() => {
                toast.info('เปิดฟอร์มเสนอซื้อใหม่');
                if (onActionComplete) onActionComplete();
              }}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              เสนอซื้อใหม่
            </Button>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isPending && (
          <Button 
            variant="secondary"
            className="bg-yellow-500 hover:bg-yellow-600 text-white"
            onClick={handleMarkInProgress}
          >
            <Clock className="h-4 w-4 mr-2" />
            {language === 'th' ? 'เริ่มดำเนินการ' : 'Start Work'}
          </Button>
        )}
        
        {isInProgress && (
          <Button 
            variant="success"
            onClick={handleMarkCompleted}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            {language === 'th' ? 'ทำงานเสร็จสิ้น' : 'Complete Task'}
          </Button>
        )}
        
        {/* New self-processing button */}
        {isPending && (
          <Button 
            variant="outline"
            className="border-blue-500 text-blue-600 hover:bg-blue-50"
            onClick={handleSelfProcess}
          >
            <UserCog className="h-4 w-4 mr-2" />
            {language === 'th' ? 'ซ่อมด้วยตนเอง' : 'Self Process'}
          </Button>
        )}
        
        {/* Self-approval button */}
        {!isPending && needsApproval && (
          <Button 
            variant="outline"
            className="border-green-500 text-green-600 hover:bg-green-50"
            onClick={() => setShowSelfApprovalModal(true)}
          >
            <FileCheck className="h-4 w-4 mr-2" />
            {language === 'th' ? 'อนุมัติด้วยตนเอง' : 'Self Approve'}
          </Button>
        )}
        
        <Button 
          variant={isInProgress ? "warning" : "outline"}
          className={isInProgress ? "" : "border-red-500 text-red-600 hover:bg-red-50"}
          onClick={() => {
            toast.info(
              language === 'th' 
                ? 'ส่งการแจ้งเตือนไปยังหัวหน้าช่างแล้ว' 
                : 'Notification sent to supervisor'
            );
            if (onActionComplete) onActionComplete();
          }}
        >
          <AlertCircle className="h-4 w-4 mr-2" />
          {language === 'th' ? 'แจ้งหัวหน้างาน' : 'Notify Supervisor'}
        </Button>
      </div>
      
      {/* Self Approval Modal */}
      {showSelfApprovalModal && repair && (
        <TechnicianSelfApprovalModal
          repair={repair}
          onClose={() => setShowSelfApprovalModal(false)}
          onApprove={handleSelfApprove}
        />
      )}
    </div>
  );
};

export default RepairActions;
