
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import NotificationCard from './NotificationCard';
import { useLanguage } from '@/contexts/LanguageContext';

interface NotificationsTabContentProps {
  title: string;
  description?: string;
  notifications: Array<{
    id: number;
    title: string;
    message: string;
    timestamp: string;
    isRead: boolean;
    type: string;
    status: string;
  }>;
  formatDate: (date: string) => string;
  emptyMessage: string;
}

const NotificationsTabContent: React.FC<NotificationsTabContentProps> = ({ 
  title, 
  description, 
  notifications,
  formatDate,
  emptyMessage
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map(notification => (
              <NotificationCard 
                key={notification.id} 
                notification={notification} 
                formatDate={formatDate} 
              />
            ))}
          </div>
        ) : (
          <p className="text-center py-8 text-gray-500">
            {emptyMessage}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationsTabContent;
