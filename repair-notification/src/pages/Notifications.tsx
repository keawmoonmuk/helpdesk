
import React from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import DashboardLayout from '@/components/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import NotificationsHeader from '@/components/notifications/NotificationsHeader';
import NotificationsTabContent from '@/components/notifications/NotificationsTabContent';

const Notifications = () => {
  const { language } = useLanguage();
  const { notifications, unreadCount, isLoading, formatDate, markAllAsRead } = useNotifications();
  
  return (
    <DashboardLayout title={language === 'th' ? 'การแจ้งเตือน' : 'Notifications'}>
      <div className="p-6">
        <NotificationsHeader unreadCount={unreadCount} onMarkAllRead={markAllAsRead} />
        
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">
                {language === 'th' ? 'ทั้งหมด' : 'All'}
              </TabsTrigger>
              <TabsTrigger value="unread">
                {language === 'th' ? 'ยังไม่ได้อ่าน' : 'Unread'}
                {unreadCount > 0 && ` (${unreadCount})`}
              </TabsTrigger>
              <TabsTrigger value="repairs">
                {language === 'th' ? 'การซ่อม' : 'Repairs'}
              </TabsTrigger>
              <TabsTrigger value="assets">
                {language === 'th' ? 'สินทรัพย์' : 'Assets'}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <NotificationsTabContent
                title={language === 'th' ? 'การแจ้งเตือนทั้งหมด' : 'All Notifications'}
                description={language === 'th' ? 'การแจ้งเตือนทั้งหมดในระบบ' : 'All notifications in the system'}
                notifications={notifications}
                formatDate={formatDate}
                emptyMessage={language === 'th' ? 'ไม่มีการแจ้งเตือน' : 'No notifications'}
              />
            </TabsContent>
            
            <TabsContent value="unread">
              <NotificationsTabContent
                title={language === 'th' ? 'การแจ้งเตือนที่ยังไม่ได้อ่าน' : 'Unread Notifications'}
                notifications={notifications.filter(n => !n.isRead)}
                formatDate={formatDate}
                emptyMessage={language === 'th' ? 'ไม่มีการแจ้งเตือนที่ยังไม่ได้อ่าน' : 'No unread notifications'}
              />
            </TabsContent>
            
            <TabsContent value="repairs">
              <NotificationsTabContent
                title={language === 'th' ? 'การแจ้งเตือนเกี่ยวกับการซ่อม' : 'Repair Notifications'}
                notifications={notifications.filter(n => n.type === 'repair')}
                formatDate={formatDate}
                emptyMessage={language === 'th' ? 'ไม่มีการแจ้งเตือนเกี่ยวกับการซ่อม' : 'No repair notifications'}
              />
            </TabsContent>
            
            <TabsContent value="assets">
              <NotificationsTabContent
                title={language === 'th' ? 'การแจ้งเตือนเกี่ยวกับสินทรัพย์' : 'Asset Notifications'}
                notifications={notifications.filter(n => n.type === 'asset')}
                formatDate={formatDate}
                emptyMessage={language === 'th' ? 'ไม่มีการแจ้งเตือนเกี่ยวกับสินทรัพย์' : 'No asset notifications'}
              />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Notifications;
