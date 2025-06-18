
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface PriorityBadgeProps {
  priority: string;
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const { t, language } = useLanguage();
  
  const getPriorityColor = (priority: string) => {
    const upperPriority = priority?.toUpperCase() || '';
    
    switch (upperPriority) {
      case 'HIGH':
        return 'bg-red-100 text-red-800';
      case 'MEDIUM':
      case 'MODERATE':
        return 'bg-yellow-100 text-yellow-800'; 
      case 'LOW':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format priority for display
  const formatPriority = (priority: string) => {
    const upperPriority = priority?.toUpperCase() || '';
    
    switch (upperPriority) {
      case 'HIGH':
        return language === 'th' ? 'สูง' : 'High';
      case 'MEDIUM':
      case 'MODERATE':
        return language === 'th' ? 'ปานกลาง' : 'Medium';
      case 'LOW':
        return language === 'th' ? 'ต่ำ' : 'Low';
      default:
        return priority;
    }
  };

  return (
    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(priority)}`}>
      {formatPriority(priority)}
    </span>
  );
};

export default PriorityBadge;
