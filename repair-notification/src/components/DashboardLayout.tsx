
import React from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import { Clock } from 'lucide-react';
import { format } from 'date-fns'; 
import { th } from 'date-fns/locale';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title }) => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const currentDate = new Date();
  
  const getRoleName = (role: string) => {
    switch (role) {
      case 'admin':
        return language === 'th' ? 'ผู้ดูแลระบบ' : 'Administrator';
      case 'technician':
        return language === 'th' ? 'ช่างเทคนิค' : 'Technician';
      case 'user':
        return language === 'th' ? 'ผู้ใช้งาน' : 'User';
      default:
        return role;
    }
  };
  
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 py-4 px-6 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">
                {title || (language === 'th' ? 'แดชบอร์ด' : t('dashboard.title'))}
              </h1>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <Clock className="h-4 w-4 mr-1" />
                <span>
                  {format(
                    currentDate, 
                    language === 'th' ? 'dd MMMM yyyy HH:mm' : 'dd/MM/yyyy HH:mm',
                    { locale: language === 'th' ? th : undefined }
                  )}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right mr-4">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-gray-500">
                  {getRoleName(user?.role || '')}
                </p>
              </div>
              <LanguageSwitcher />
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
