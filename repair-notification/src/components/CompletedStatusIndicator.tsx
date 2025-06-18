
import React from 'react';
import { Clock, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface CompletedStatusIndicatorProps {
  status: string;
  completionDate?: string;
  className?: string;
}

const CompletedStatusIndicator: React.FC<CompletedStatusIndicatorProps> = ({
  status,
  completionDate,
  className = ''
}) => {
  const { language } = useLanguage();
  const isCompleted = status === 'เสร็จสิ้น' || status.toLowerCase() === 'completed';
  
  if (!isCompleted) {
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full ${
        status === 'กำลังดำเนินการ' || status.toLowerCase().includes('progress')
          ? 'bg-yellow-100 text-yellow-800'
          : 'bg-blue-100 text-blue-800'
      } ${className}`}>
        <Clock className="w-3 h-3 mr-1" />
        {status}
      </span>
    );
  }
  
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full bg-green-100 text-green-800 ${className}`}>
      <CheckCircle className="w-3 h-3 mr-1" />
      {language === 'th' ? 'เสร็จสิ้น' : 'Completed'}
      {completionDate && (
        <span className="ml-1 text-xs opacity-75">
          ({completionDate})
        </span>
      )}
    </span>
  );
};

export default CompletedStatusIndicator;
