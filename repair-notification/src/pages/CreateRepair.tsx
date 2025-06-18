
import DashboardLayout from "@/components/DashboardLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Wrench, ArrowLeft } from "lucide-react";
import { RepairRequestForm } from "@/components/repair-request-form/RepairRequestForm";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const CreateRepair = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const handleSuccess = () => {
    toast.success(
      language === 'th' 
        ? 'สร้างคำขอซ่อมเรียบร้อยแล้ว' 
        : 'Repair request created successfully'
    );
    navigate('/dashboard');
  };

  const handleClose = () => {
    navigate('/dashboard');
  };

  return (
    <DashboardLayout title={language === 'th' ? 'สร้างคำขอซ่อม' : 'Create Repair Request'}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" className="mr-2" asChild>
            <a href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-1" />
              {language === 'th' ? 'กลับไปยังแดชบอร์ด' : 'Back to Dashboard'}
            </a>
          </Button>
          <h1 className="text-2xl font-bold flex items-center">
            <Wrench className="mr-2 h-6 w-6 text-blue-600" />
            {language === 'th' ? 'สร้างคำขอซ่อมใหม่' : 'Create New Repair Request'}
          </h1>
        </div>
      </div>

      <Card className="p-6">
        <RepairRequestForm onSuccess={handleSuccess} onClose={handleClose} />
      </Card>
    </DashboardLayout>
  );
};

export default CreateRepair;
