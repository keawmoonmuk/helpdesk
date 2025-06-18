
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRoleBasedApi } from '@/hooks/useRoleBasedApi';
import { useQuery } from '@tanstack/react-query';
import { useToast } from "@/hooks/use-toast";

export interface Notification {
  id: number;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: string;
  status: string;
}

export const useNotifications = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const api = useRoleBasedApi();
  
  // Mock data for notifications - in real app, this would come from the API
  const allNotifications = [
    {
      id: 1,
      title: 'Repair Request Approved',
      message: 'Your repair request #1234 has been approved',
      timestamp: '2023-08-10T14:23:00Z',
      isRead: false,
      type: 'repair',
      status: 'approved',
    },
    {
      id: 2,
      title: 'Technician Assigned',
      message: 'John Doe has been assigned to your repair request #1234',
      timestamp: '2023-08-09T10:15:00Z',
      isRead: true,
      type: 'repair',
      status: 'in-progress',
    },
    {
      id: 3,
      title: 'New Asset Assigned',
      message: 'You have been assigned a new laptop (Asset #LP-2023-089)',
      timestamp: '2023-08-05T09:30:00Z',
      isRead: true,
      type: 'asset',
      status: 'info',
    },
    {
      id: 4,
      title: 'Repair Completed',
      message: 'Your repair request #1200 has been completed',
      timestamp: '2023-08-01T16:45:00Z',
      isRead: true,
      type: 'repair',
      status: 'completed',
    },
  ];

  // Fetch notifications from API
  const { isLoading, error, data } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      return await api.notifications.getNotifications();
    }
  });
  
  // Handle error separately
  if (error) {
    toast({
      title: 'Failed to load notifications',
      description: error instanceof Error ? error.message : 'Please try again later',
      variant: 'destructive',
    });
  }

  const unreadCount = allNotifications.filter(n => !n.isRead).length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'th' ? 'th-TH' : 'en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const markAllAsRead = () => {
    // This would typically be an API call
    console.log('Marking all notifications as read');
    // In a real app, update the notifications state here
  };

  return {
    notifications: allNotifications,
    unreadCount,
    isLoading,
    formatDate,
    markAllAsRead
  };
};
