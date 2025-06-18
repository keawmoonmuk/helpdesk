
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { RepairRequestFormData } from '@/schemas/repairRequestSchema';

interface PriorityFieldProps {
  form: UseFormReturn<RepairRequestFormData>;
  t: (key: string, options?: any) => string;
  language: string;
}

export const PriorityField = ({ form, t, language }: PriorityFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="priority"
      render={({ field }) => (
        <FormItem className="mb-4">
          <FormLabel>{language === 'th' ? 'ความสำคัญ' : t('dashboard.priority')}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={language === 'th' ? 'เลือกความสำคัญ' : "Select priority"} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="Low">
                {language === 'th' ? 'ต่ำ' : t('priority.low')}
              </SelectItem>
              <SelectItem value="Medium">
                {language === 'th' ? 'ปานกลาง' : t('priority.medium')}
              </SelectItem>
              <SelectItem value="High">
                {language === 'th' ? 'สูง' : t('priority.high')}
              </SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
