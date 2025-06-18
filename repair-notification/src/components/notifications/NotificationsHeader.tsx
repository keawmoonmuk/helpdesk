
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface NotificationsHeaderProps {
  unreadCount: number;
  onMarkAllRead: () => void;
}

const NotificationsHeader: React.FC<NotificationsHeaderProps> = ({ unreadCount, onMarkAllRead }) => {
  const { language } = useLanguage();
  
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold">
          {language === 'th' ? 'การแจ้งเตือน' : 'Notifications'}
          {unreadCount > 0 && (
            <Badge variant="outline" className="ml-2 bg-red-100 text-red-800 border-red-200">
              {unreadCount} {language === 'th' ? 'ใหม่' : 'new'}
            </Badge>
          )}
        </h1>
        <p className="text-gray-500 mt-1">
          {language === 'th' ? 'จัดการการแจ้งเตือนของคุณ' : 'Manage your notifications'}
        </p>
      </div>
      <Button variant="outline" onClick={onMarkAllRead}>
        {language === 'th' ? 'ทำเครื่องหมายว่าอ่านแล้วทั้งหมด' : 'Mark all as read'}
      </Button>
    </div>
  );
};

export default NotificationsHeader;
