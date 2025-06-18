
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { RepairRequestFormData } from '@/schemas/repairRequestSchema';

interface AssetFieldsProps {
  form: UseFormReturn<RepairRequestFormData>;
  t: (key: string, options?: any) => string;
  language: string;
}

export const AssetFields = ({ form, t, language }: AssetFieldsProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <FormField
          control={form.control}
          name="assetName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{language === 'th' ? 'ชื่อทรัพย์สิน' : t('dashboard.assetName')}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={language === 'th' ? 'เช่น คอมพิวเตอร์' : "e.g. Computer"} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="assetCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{language === 'th' ? 'เลขทรัพย์สิน' : t('dashboard.assetCode')}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={language === 'th' ? 'เช่น PC-001' : "e.g. PC-001"} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <FormField
          control={form.control}
          name="assetLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{language === 'th' ? 'ที่อยู่ทรัพย์สิน' : t('dashboard.assetLocation')}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={language === 'th' ? 'เช่น ห้องประชุม 1' : "e.g. Meeting Room 1"} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="serialNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{language === 'th' ? 'หมายเลขเครื่อง' : t('dashboard.serialNumber')}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={language === 'th' ? 'เช่น SN-12345' : "e.g. SN-12345"} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};
