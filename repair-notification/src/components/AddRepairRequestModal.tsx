
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { RepairRequestForm } from './repair-request-form/RepairRequestForm';
import { FileText } from 'lucide-react';
import { toast } from 'sonner';

interface AddRepairRequestModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AddRepairRequestModal = ({ onClose, onSuccess }: AddRepairRequestModalProps) => {
  const { language, t } = useLanguage();
  
  const handleSuccess = () => {
    toast.success(
      language === 'th' 
        ? 'สร้างคำขอซ่อมเรียบร้อยแล้ว' 
        : 'Repair request created successfully'
    );
    onSuccess();
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center space-x-2">
          <FileText className="h-5 w-5 text-blue-600" />
          <DialogTitle>
            {language === 'th' 
              ? 'แจ้งซ่อมใหม่' 
              : t('dashboard.addRepairRequest')}
          </DialogTitle>
        </DialogHeader>
        <RepairRequestForm onClose={onClose} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
};

export default AddRepairRequestModal;
