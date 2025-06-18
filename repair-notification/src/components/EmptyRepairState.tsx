
import React from 'react';
import { MessageSquareWarning } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

export interface EmptyRepairStateProps {
  onAddRepair?: () => void;  // Make this prop optional
}

const EmptyRepairState: React.FC<EmptyRepairStateProps> = ({ onAddRepair }) => {
  const { language } = useLanguage();
  
  return (
    <div className="p-12 flex flex-col items-center justify-center text-center">
      <MessageSquareWarning className="h-16 w-16 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium mb-2">
        {language === 'th' ? 'ไม่มีรายการแจ้งซ่อม' : 'No repair requests'}
      </h3>
      <p className="text-gray-500 mb-6 max-w-md">
        {language === 'th' 
          ? 'คุณยังไม่มีรายการแจ้งซ่อม คลิกปุ่มด้านล่างเพื่อสร้างรายการแจ้งซ่อมใหม่' 
          : 'You have no repair requests yet. Click the button below to create a new request.'}
      </p>
      {onAddRepair && (
        <Button 
          onClick={onAddRepair}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {language === 'th' ? '+ สร้างรายการแจ้งซ่อมใหม่' : '+ Create New Repair Request'}
        </Button>
      )}
    </div>
  );
};

export default EmptyRepairState;
