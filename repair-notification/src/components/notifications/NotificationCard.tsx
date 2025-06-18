
import React from 'react';
import { Badge } from '@/components/ui/badge';
import RepairStatusBadge from '@/components/RepairStatusBadge';
import { Bell, Check, Clock, Wrench } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface NotificationCardProps {
  notification: {
    id: number;
    title: string;
    message: string;
    timestamp: string;
    isRead: boolean;
    type: string;
    status: string;
  };
  formatDate: (date: string) => string;
}

const NotificationCard: React.FC<NotificationCardProps> = ({ notification, formatDate }) => {
  const getNotificationIcon = (type: string, status: string) => {
    switch (type) {
      case 'repair':
        if (status === 'completed') return <Check className="h-5 w-5 text-green-500" />;
        if (status === 'in-progress') return <Wrench className="h-5 w-5 text-blue-500" />;
        if (status === 'approved') return <Clock className="h-5 w-5 text-yellow-500" />;
        return <Bell className="h-5 w-5 text-gray-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div 
      key={notification.id} 
      className={`p-4 rounded-lg border ${notification.isRead ? 'border-gray-200' : 'border-blue-200 bg-blue-50'} hover:bg-gray-50 transition-colors`}
    >
      <div className="flex items-start gap-4">
        <div className="mt-1">
          {getNotificationIcon(notification.type, notification.status)}
        </div>
        <div className="flex-1">
          <div className="flex justify-between">
            <h3 className={`font-medium ${!notification.isRead && 'text-blue-600'}`}>
              {notification.title}
            </h3>
            <span className="text-xs text-gray-500">
              {formatDate(notification.timestamp)}
            </span>
          </div>
          <p className="text-gray-600 mt-1">{notification.message}</p>
          {notification.type === 'repair' && (
            <div className="mt-2">
              <RepairStatusBadge status={notification.status} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
