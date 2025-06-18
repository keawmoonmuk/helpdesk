
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface RepairStatusBadgeProps {
  status: string;
}

const RepairStatusBadge: React.FC<RepairStatusBadgeProps> = ({ status }) => {
  const { language } = useLanguage();
  
  const getStatusColor = (status: string) => {
    const upperStatus = status?.toUpperCase() || '';
    
    switch (upperStatus) {
      case 'COMPLETED':
      case 'เสร็จสิ้น':
        return 'bg-green-500 text-white';
      case 'IN PROGRESS':
      case 'IN-PROGRESS':
      case 'กำลังดำเนินการ':
        return 'bg-yellow-500 text-white';
      case 'PENDING':
      case 'รอดำเนินการ':
      case 'WAITING FOR ACTION':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  // Format status for display - convert from API format to user-friendly format
  const formatStatus = (status: string) => {
    const upperStatus = status?.toUpperCase() || '';
    
    switch (upperStatus) {
      case 'COMPLETED':
        return language === 'th' ? 'เสร็จสิ้น' : 'Completed';
      case 'IN PROGRESS':
      case 'IN-PROGRESS':
        return language === 'th' ? 'กำลังดำเนินการ' : 'In Progress';
      case 'PENDING':
        return language === 'th' ? 'รอดำเนินการ' : 'Pending';
      case 'WAITING FOR ACTION':
        return language === 'th' ? 'รอดำเนินการ' : 'Waiting for Action';
      default:
        return status;
    }
  };

  return (
    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(status)}`}>
      {formatStatus(status)}
    </span>
  );
};

export default RepairStatusBadge;
