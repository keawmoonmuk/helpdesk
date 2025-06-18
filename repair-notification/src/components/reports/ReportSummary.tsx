
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Button } from '@/components/ui/button';
import { Download, BarChartIcon, PieChartIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const ReportSummary = () => {
  const { language } = useLanguage();
  
  // Mock data for bar chart - will be replaced with actual data from API
  const barData = [
    { month: language === 'th' ? 'ม.ค.' : 'Jan', completed: 12, pending: 5 },
    { month: language === 'th' ? 'ก.พ.' : 'Feb', completed: 19, pending: 3 },
    { month: language === 'th' ? 'มี.ค.' : 'Mar', completed: 15, pending: 8 },
    { month: language === 'th' ? 'เม.ย.' : 'Apr', completed: 21, pending: 6 },
    { month: language === 'th' ? 'พ.ค.' : 'May', completed: 18, pending: 4 },
    { month: language === 'th' ? 'มิ.ย.' : 'Jun', completed: 14, pending: 7 },
  ];

  // Mock data for pie chart - will be replaced with actual data from API
  const pieData = [
    { name: language === 'th' ? 'คอมพิวเตอร์' : 'Computers', value: 35, color: '#3b82f6' },
    { name: language === 'th' ? 'เครื่องพิมพ์' : 'Printers', value: 24, color: '#10b981' },
    { name: language === 'th' ? 'เครือข่าย' : 'Network', value: 18, color: '#f59e0b' },
    { name: language === 'th' ? 'เซิร์ฟเวอร์' : 'Servers', value: 12, color: '#8b5cf6' },
    { name: language === 'th' ? 'อื่นๆ' : 'Others', value: 11, color: '#6b7280' },
  ];
  
  // Mock data for department performance - will be replaced with actual data from API
  const departmentData = [
    { 
      department: language === 'th' ? 'ฝ่ายไอที' : 'IT Department', 
      completed: 42, 
      avgTime: '1.5', 
      satisfaction: '4.8',
      performance: 'high'
    },
    { 
      department: language === 'th' ? 'ฝ่ายบัญชี' : 'Accounting', 
      completed: 28, 
      avgTime: '2.1', 
      satisfaction: '4.3',
      performance: 'medium'
    },
    { 
      department: language === 'th' ? 'ฝ่ายขาย' : 'Sales', 
      completed: 35, 
      avgTime: '1.8', 
      satisfaction: '4.5',
      performance: 'high'
    },
    { 
      department: language === 'th' ? 'ฝ่ายผลิต' : 'Production', 
      completed: 22, 
      avgTime: '2.4', 
      satisfaction: '4.1',
      performance: 'medium'
    },
    { 
      department: language === 'th' ? 'ฝ่ายทรัพยากรบุคคล' : 'HR', 
      completed: 18, 
      avgTime: '1.7', 
      satisfaction: '4.6',
      performance: 'high'
    },
  ];

  const getPerformanceBadge = (performance: string) => {
    if (performance === 'high') {
      return <span className="inline-block px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">{language === 'th' ? 'สูง' : 'High'}</span>;
    } else if (performance === 'medium') {
      return <span className="inline-block px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">{language === 'th' ? 'ปานกลาง' : 'Medium'}</span>;
    } else {
      return <span className="inline-block px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">{language === 'th' ? 'ต่ำ' : 'Low'}</span>;
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{language === 'th' ? 'การซ่อมทั้งหมด' : 'Repair Completions'}</CardTitle>
                <CardDescription>
                  {language === 'th' ? 'ภาพรวมการซ่อมในแต่ละเดือน' : 'Monthly repair completion overview'}
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-3.5 w-3.5 mr-1" />
                {language === 'th' ? 'ดาวน์โหลด' : 'Export'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completed" name={language === 'th' ? 'เสร็จสิ้น' : 'Completed'} fill="#3b82f6" />
                  <Bar dataKey="pending" name={language === 'th' ? 'รอดำเนินการ' : 'Pending'} fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{language === 'th' ? 'ประเภทการซ่อม' : 'Repair Categories'}</CardTitle>
                <CardDescription>
                  {language === 'th' ? 'การแบ่งประเภทการซ่อมตามหมวดหมู่' : 'Distribution of repairs by category'}
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-3.5 w-3.5 mr-1" />
                {language === 'th' ? 'ดาวน์โหลด' : 'Export'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6 mt-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{language === 'th' ? 'ประสิทธิภาพของแผนก' : 'Department Performance'}</CardTitle>
                <CardDescription>
                  {language === 'th' ? 'ประสิทธิภาพในการแก้ไขปัญหาแยกตามแผนก' : 'Repair efficiency by department'}
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <BarChartIcon className="h-3.5 w-3.5 mr-1" />
                  {language === 'th' ? 'แผนภูมิแท่ง' : 'Bar Chart'}
                </Button>
                <Button variant="outline" size="sm">
                  <PieChartIcon className="h-3.5 w-3.5 mr-1" />
                  {language === 'th' ? 'แผนภูมิวงกลม' : 'Pie Chart'}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 text-left font-medium text-gray-500">{language === 'th' ? 'แผนก' : 'Department'}</th>
                    <th className="py-3 text-center font-medium text-gray-500">{language === 'th' ? 'การซ่อมที่เสร็จสิ้น' : 'Completed Repairs'}</th>
                    <th className="py-3 text-center font-medium text-gray-500">{language === 'th' ? 'เวลาเฉลี่ย (วัน)' : 'Avg. Time (days)'}</th>
                    <th className="py-3 text-center font-medium text-gray-500">{language === 'th' ? 'ความพึงพอใจ (5)' : 'Satisfaction (of 5)'}</th>
                    <th className="py-3 text-center font-medium text-gray-500">{language === 'th' ? 'ประสิทธิภาพ' : 'Performance'}</th>
                  </tr>
                </thead>
                <tbody>
                  {departmentData.map((dept, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 text-left">{dept.department}</td>
                      <td className="py-3 text-center">{dept.completed}</td>
                      <td className="py-3 text-center">{dept.avgTime}</td>
                      <td className="py-3 text-center">{dept.satisfaction}</td>
                      <td className="py-3 text-center">{getPerformanceBadge(dept.performance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ReportSummary;
