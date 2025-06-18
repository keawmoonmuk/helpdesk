
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Check, Clock, AlertTriangle, Wrench } from 'lucide-react';
import { DashboardStats } from '@/types';
// import { log } from 'console';

interface DashboardStatsCardsProps {
  stats: DashboardStats;
  isLoading: boolean;
}

const DashboardStatsCards: React.FC<DashboardStatsCardsProps> = ({ stats, isLoading }) => {
  const { t, language } = useLanguage();

  console.log('DashboardStatsCards rendered with stats:', stats);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-gray-200"></div>
              <div className="ml-4 w-full">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-6 bg-gray-300 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600">
            <Wrench className="h-8 w-8" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">
              {language === 'th' ? 'การซ่อมที่กำลังดำเนินการ' : t('dashboard.activeRepairs')}
            </p>
            <p className="text-2xl font-semibold">{stats.activeRepairs}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-600">
            <Check className="h-8 w-8" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">
              {language === 'th' ? 'เสร็จสิ้นวันนี้' : t('dashboard.completedToday')}
            </p>
            <p className="text-2xl font-semibold">{stats.completedToday}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
            <Clock className="h-8 w-8" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">
              {language === 'th' ? 'รอดำเนินการ' : t('dashboard.pending')}
            </p>
            <p className="text-2xl font-semibold">{stats.pending}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-red-100 text-red-600">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">
              {language === 'th' ? 'เร่งด่วน' : t('dashboard.urgent')}
            </p>
            <p className="text-2xl font-semibold">{stats.urgent}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStatsCards;
