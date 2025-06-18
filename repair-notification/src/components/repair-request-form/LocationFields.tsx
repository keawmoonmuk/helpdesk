
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { RepairRequestFormData, departmentOptions } from '@/schemas/repairRequestSchema';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import apiClient from '@/services/api';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';

interface LocationFieldsProps {
  form: UseFormReturn<RepairRequestFormData>;
  t: (key: string, options?: any) => string;
  language: string;
}

export const LocationFields = ({ form, t, language }: LocationFieldsProps) => {

  const [departments, setDepartments] = useState<{value: string, label: string}[]>([]);

   // ฟังก์ชันเพื่อดึงข้อมูลแผนกจาก API
 const fetchDepartments = async () => {
  try {
    const departments = await apiClient.getDepartments();
    setDepartments(departments);  // เก็บข้อมูลแผนกที่ได้จาก API
      // ตั้งค่าเริ่มต้นเป็น HR หากมีในข้อมูลที่ดึงมา
      const defaultDepartment = departments.find((dept) => dept.value === "HR");
      if (defaultDepartment) {
        form.setValue("department", defaultDepartment.value); // ตั้งค่าเริ่มต้นในฟอร์ม
      }
  } catch (error) {
    console.log("Error fetching departments:", error);
    toast.error(language === 'th' ? 'เกิดข้อผิดพลาดในการดึงข้อมูลแผนก' : 'Error fetching departments');
  }
 }

 useEffect(() => {
  fetchDepartments(); // เรียกใช้ฟังก์ชันเพื่อดึงข้อมูลแผนกเมื่อคอมโพเนนต์ถูกเรนเดอร์
 },[])

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <FormField
          control={form.control}
          name="reportDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{language === 'th' ? 'วันที่แจ้ง' : t('dashboard.reportDate')}</FormLabel>
              <FormControl>
                <Input {...field} type="date" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reporterName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{language === 'th' ? 'ชื่อผู้แจ้ง' : t('dashboard.reporterName')}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={language === 'th' ? 'ชื่อผู้แจ้ง' : "Reporter name"} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <FormField
          control={form.control}
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{language === 'th' ? 'แผนก' : t('dashboard.department')}</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={language === 'th' ? 'เลือกแผนก' : "Select department"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.value} value={dept.value}>
                      {dept.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="building"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{language === 'th' ? 'อาคาร' : t('dashboard.building')}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={language === 'th' ? 'เช่น อาคาร 1' : "e.g. Building 1"} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="floor"
        render={({ field }) => (
          <FormItem className="mb-4">
            <FormLabel>{language === 'th' ? 'ชั้น' : t('dashboard.floor')}</FormLabel>
            <FormControl>
              <Input {...field} placeholder={language === 'th' ? 'เช่น ชั้น 2' : "e.g. Floor 2"} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
