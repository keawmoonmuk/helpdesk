
import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useRoleBasedApi } from '@/hooks/useRoleBasedApi';
import { useToast } from '@/hooks/use-toast';

// Import our new components
import ReportsHeader from '@/components/reports/ReportsHeader';
import ReportSummary from '@/components/reports/ReportSummary';
import { RepairsReport, DepartmentsReport } from '@/components/reports/DetailedReports';

const Reports = () => {
  const { language } = useLanguage();
  const [timeRange, setTimeRange] = useState('month');
  const api = useRoleBasedApi();
  const { toast } = useToast();
  
  // Fetch reports data
  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ['userReports'],
    queryFn: async () => {
      return await api.reports.getReports();
    }
  });

  // Handle error separately
  if (error) {
    toast({
      title: 'Failed to load reports',
      description: error instanceof Error ? error.message : 'Please try again later',
      variant: 'destructive',
    });
  }

  return (
    <DashboardLayout title={language === 'th' ? 'รายงาน' : 'Reports'}>
      <ReportsHeader 
        onRefresh={() => refetch()} 
        timeRange={timeRange} 
        setTimeRange={setTimeRange} 
      />

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : (
        <Tabs defaultValue="summary">
          <TabsList>
            <TabsTrigger value="summary">
              {language === 'th' ? 'สรุป' : 'Summary'}
            </TabsTrigger>
            <TabsTrigger value="repairs">
              {language === 'th' ? 'การซ่อม' : 'Repairs'}
            </TabsTrigger>
            <TabsTrigger value="departments">
              {language === 'th' ? 'แผนก' : 'Departments'}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary">
            <ReportSummary />
          </TabsContent>
          
          <TabsContent value="repairs">
            <RepairsReport />
          </TabsContent>
          
          <TabsContent value="departments">
            <DepartmentsReport />
          </TabsContent>
        </Tabs>
      )}
    </DashboardLayout>
  );
};

export default Reports;
