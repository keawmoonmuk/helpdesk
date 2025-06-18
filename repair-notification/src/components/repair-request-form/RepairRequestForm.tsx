
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { AssetFields } from './AssetFields';
import { LocationFields } from './LocationFields';
import { ProblemDetailsField } from './ProblemDetailsField';
import { PriorityField } from './PriorityField';
import { useRepairRequestForm } from '@/hooks/useRepairRequestForm';
import { useState, useRef } from 'react';
import { Camera, X, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface RepairRequestFormProps {
  onClose?: () => void;
  onSuccess: () => void;
}

// แบบ form สำหรับการแจ้งซ่อม
export const RepairRequestForm = ({ onClose = () => {}, onSuccess }: RepairRequestFormProps) => {
  const { form, onSubmit, loading, t, language } = useRepairRequestForm({ onSuccess });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ฟังก์ชั่นสำหรับจัดการการเปลี่ยนแปลงไฟล์ image
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles: File[] = [];
    const newPreviewUrls: string[] = [];
    setUploadError(null);

    const availableSlots = 7 - selectedFiles.length;
    const filesToProcess = Math.min(files.length, availableSlots);

    if (files.length > availableSlots) {
      setUploadError(language === 'th' 
        ? `สามารถอัพโหลดได้สูงสุด 7 รูปเท่านั้น (${selectedFiles.length} รูปถูกอัพโหลดแล้ว)`
        : `You can only upload up to 7 images (${selectedFiles.length} already uploaded)`);
    }

    for (let i = 0; i < filesToProcess; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        if (file.size > 5 * 1024 * 1024) {
          setUploadError(language === 'th' 
            ? 'ขนาดไฟล์ต้องไม่เกิน 5MB'
            : 'File size must be less than 5MB');
          continue;
        }
        newFiles.push(file);
        newPreviewUrls.push(URL.createObjectURL(file));
      } else {
        setUploadError(language === 'th' 
          ? 'กรุณาอัพโหลดไฟล์รูปภาพเท่านั้น'
          : 'Please upload image files only');
      }
    }

    setSelectedFiles([...selectedFiles, ...newFiles]);
    setPreviewUrls([...previewUrls, ...newPreviewUrls]);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // ฟังก์ชั่นสำหรับลบไฟล์ที่เลือก
  const removeFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
    
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls(previewUrls.filter((_, i) => i !== index));
  };

  // ฟังก์ชั่นสำหรับจัดการการส่งแบบฟอร์ม
  const handleFormSubmit = async (data: any) => {
    try {
      const imagePromises = selectedFiles.map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(file);
        });
      });

      const imageUrls = await Promise.all(imagePromises);
      
      // Add images to the form data
      data.images = imageUrls;
      
      await onSubmit(data);
    } catch (error) {
      console.error('Error submitting form with images:', error);
      toast.error(language === 'th' 
        ? 'เกิดข้อผิดพลาดในการส่งคำขอซ่อม'
        : 'Error submitting repair request');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <LocationFields form={form} t={t} language={language} />
        <AssetFields form={form} t={t} language={language} />
        <ProblemDetailsField form={form} t={t} language={language} />
        <PriorityField form={form} t={t} language={language} />
        
        <div className="mt-6">
          <p className="text-sm text-gray-500 mb-2 flex items-center">
            <Camera className="mr-2 h-4 w-4 text-blue-500" />
            {language === 'th' ? 'อัพโหลดรูปภาพ (สูงสุด 7 รูป)' : 'Upload images (max 7)'}
          </p>
          
          {previewUrls.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mb-4">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <img 
                    src={url} 
                    alt={`Preview ${index}`}
                    className="h-24 w-full object-cover rounded-md border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {uploadError && (
            <div className="text-red-500 text-sm mb-2 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {uploadError}
            </div>
          )}
          
          {selectedFiles.length < 7 && (
            <label className="border-2 border-dashed border-blue-300 rounded-md p-8 flex flex-col items-center justify-center bg-blue-50 cursor-pointer hover:bg-blue-100 transition-colors">
              <input
                type="file"
                onChange={handleFileChange}
                multiple
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
              />
              <Camera className="text-blue-400 mb-2 h-8 w-8" />
              <p className="text-blue-500 text-center">
                {language === 'th' ? 'คลิกเพื่ออัพโหลดไฟล์' : 'Click to upload files'}
              </p>
              <p className="text-xs text-blue-400 mt-1">
                {language === 'th' 
                  ? `${selectedFiles.length}/7 รูปภาพ` 
                  : `${selectedFiles.length}/7 images`}
              </p>
            </label>
          )}
        </div>

        <DialogFooter className="pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            {language === 'th' ? 'ยกเลิก' : t('common.cancel')}
          </Button>
          <Button
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
                {language === 'th' ? 'กำลังส่ง...' : t('common.submitting')}
              </div>
            ) : (
              language === 'th' ? 'ส่งคำขอ' : t('common.submit')
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
