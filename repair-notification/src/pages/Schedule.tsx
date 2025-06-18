
import { useState } from 'react';
import { useRoleBasedApi } from '@/hooks/useRoleBasedApi';
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';

const Schedule = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { language } = useLanguage();
  const { toast } = useToast();
  const api = useRoleBasedApi();
  
  const { isLoading, error, data } = useQuery({
    queryKey: ['schedule'],
    queryFn: async () => {
      return await api.schedule.getSchedule();
    }
  });
  
  // Handle error separately
  if (error) {
    toast({
      title: 'Failed to load schedule',
      description: error instanceof Error ? error.message : 'Please try again later',
      variant: 'destructive',
    });
  }
  
  // Mock appointments data (replace with real data from API)
  const appointments = [
    {
      id: 1,
      title: 'Computer Repair - Room 101',
      date: '2023-08-15',
      status: 'confirmed',
      client: 'John Doe',
      time: '09:00 - 10:00',
    },
    {
      id: 2,
      title: 'Network Setup - Marketing Dept',
      date: '2023-08-15',
      status: 'pending',
      client: 'Jane Smith',
      time: '14:00 - 16:00',
    },
    {
      id: 3,
      title: 'Printer Troubleshooting - HR Dept',
      date: '2023-08-17',
      status: 'confirmed',
      client: 'Alice Johnson',
      time: '11:30 - 12:30',
    }
  ];
  
  const filteredAppointments = appointments.filter(appointment => {
    // Simplified check - in real app, do proper date comparison
    return appointment.date === '2023-08-15';
  });
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'confirmed':
        return <Badge className="bg-green-500">{language === 'th' ? 'ยืนยันแล้ว' : 'Confirmed'}</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">{language === 'th' ? 'รอการยืนยัน' : 'Pending'}</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">{language === 'th' ? 'ยกเลิก' : 'Cancelled'}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <DashboardLayout title={language === 'th' ? 'ตารางเวลา' : 'Schedule'}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{language === 'th' ? 'ตารางเวลา' : 'Schedule'}</h1>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {language === 'th' ? 'สร้างการนัดหมาย' : 'New Appointment'}
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'th' ? 'ปฏิทิน' : 'Calendar'}</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>
                  {date ? new Date(date).toLocaleDateString(language === 'th' ? 'th-TH' : 'en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  }) : ''}
                </CardTitle>
                <CardDescription>
                  {filteredAppointments.length
                    ? language === 'th' 
                      ? `${filteredAppointments.length} การนัดหมาย`
                      : `${filteredAppointments.length} Appointments`
                    : language === 'th'
                      ? 'ไม่มีการนัดหมาย'
                      : 'No appointments'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="day">
                  <TabsList>
                    <TabsTrigger value="day">{language === 'th' ? 'วัน' : 'Day'}</TabsTrigger>
                    <TabsTrigger value="week">{language === 'th' ? 'สัปดาห์' : 'Week'}</TabsTrigger>
                    <TabsTrigger value="month">{language === 'th' ? 'เดือน' : 'Month'}</TabsTrigger>
                  </TabsList>
                  <TabsContent value="day">
                    {filteredAppointments.length > 0 ? (
                      <div className="space-y-4 mt-4">
                        {filteredAppointments.map(appointment => (
                          <div key={appointment.id} className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{appointment.title}</h3>
                                <p className="text-sm text-gray-500">
                                  {appointment.client} • {appointment.time}
                                </p>
                              </div>
                              {getStatusBadge(appointment.status)}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center py-8 text-gray-500">
                        {language === 'th' ? 'ไม่มีการนัดหมาย' : 'No appointments for this day'}
                      </p>
                    )}
                  </TabsContent>
                  <TabsContent value="week">
                    <p className="text-center py-8 text-gray-500">
                      {language === 'th' ? 'ตารางเวลาสัปดาห์นี้' : 'Weekly schedule view'}
                    </p>
                  </TabsContent>
                  <TabsContent value="month">
                    <p className="text-center py-8 text-gray-500">
                      {language === 'th' ? 'ตารางเวลาเดือนนี้' : 'Monthly schedule view'}
                    </p>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Schedule;
