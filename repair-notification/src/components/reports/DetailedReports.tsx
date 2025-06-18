
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

export const RepairsReport = () => {
  const { language } = useLanguage();
  
  return (
    <div className="mt-6">
      <Card>
        <CardHeader>
          <CardTitle>{language === 'th' ? 'รายงานการซ่อมทั้งหมด' : 'All Repair Reports'}</CardTitle>
          <CardDescription>
            {language === 'th' ? 'รายละเอียดของการซ่อมทั้งหมดในระบบ' : 'Detailed information about all repairs in the system'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center py-8 text-gray-500">
            {language === 'th' 
              ? 'ข้อมูลรายละเอียดการซ่อมจะแสดงที่นี่' 
              : 'Detailed repair information will be displayed here'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export const DepartmentsReport = () => {
  const { language } = useLanguage();
  
  return (
    <div className="mt-6">
      <Card>
        <CardHeader>
          <CardTitle>{language === 'th' ? 'รายงานประสิทธิภาพแผนก' : 'Department Performance Reports'}</CardTitle>
          <CardDescription>
            {language === 'th' ? 'รายละเอียดประสิทธิภาพของแต่ละแผนก' : 'Detailed performance metrics for each department'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center py-8 text-gray-500">
            {language === 'th' 
              ? 'ข้อมูลประสิทธิภาพแผนกจะแสดงที่นี่' 
              : 'Department performance metrics will be displayed here'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
