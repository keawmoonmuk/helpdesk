
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Filter, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ReportsHeaderProps {
  onRefresh: () => void;
  timeRange: string;
  setTimeRange: (value: string) => void;
}

export const ReportsHeader = ({ onRefresh, timeRange, setTimeRange }: ReportsHeaderProps) => {
  const { language } = useLanguage();
  
  return (
    <div className="mb-6 flex justify-between items-center">
      <h1 className="text-2xl font-bold">{language === 'th' ? 'ภาพรวมรายงาน' : 'Reports Overview'}</h1>
      <div className="flex items-center space-x-3">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={language === 'th' ? 'เลือกช่วงเวลา' : 'Select time range'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">{language === 'th' ? 'สัปดาห์นี้' : 'This Week'}</SelectItem>
            <SelectItem value="month">{language === 'th' ? 'เดือนนี้' : 'This Month'}</SelectItem>
            <SelectItem value="quarter">{language === 'th' ? 'ไตรมาสนี้' : 'This Quarter'}</SelectItem>
            <SelectItem value="year">{language === 'th' ? 'ปีนี้' : 'This Year'}</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ReportsHeader;
