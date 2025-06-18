
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { RepairRequestFormData } from '@/schemas/repairRequestSchema';

interface ProblemDetailsFieldProps {
  form: UseFormReturn<RepairRequestFormData>;
  t: (key: string, options?: any) => string;
  language: string;
}

export const ProblemDetailsField = ({ form, t, language }: ProblemDetailsFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="problemDetails"
      render={({ field }) => (
        <FormItem className="mb-4">
          <FormLabel>{language === 'th' ? 'รายละเอียดการซ่อม' : t('dashboard.problemDetails')}</FormLabel>
          <FormControl>
            <Textarea 
              {...field} 
              rows={5} 
              placeholder={language === 'th' ? 'กรุณาระบุรายละเอียดการซ่อมที่ต้องการ' : "Please describe the repair details"} 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
