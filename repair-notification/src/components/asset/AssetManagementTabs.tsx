
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { FileCheck, User, Contact, History, Computer, Database } from 'lucide-react';

interface AssetManagementTabsProps {
  children: {
    details: React.ReactNode;
    ownership?: React.ReactNode;
    responsibility?: React.ReactNode;
    repairs?: React.ReactNode;
  };
  assetType?: 'hardware' | 'software';
  onAssetTypeChange?: (type: 'hardware' | 'software') => void;
}

export function AssetManagementTabs({ children, assetType = 'hardware', onAssetTypeChange }: AssetManagementTabsProps) {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState("details");

  const handleAssetTypeChange = (type: 'hardware' | 'software') => {
    if (onAssetTypeChange) {
      onAssetTypeChange(type);
    }
  };

  return (
    <div className="space-y-4">
      {/* Asset Type Selection Tabs (Hardware/Software) */}
      {onAssetTypeChange && (
        <Tabs value={assetType} onValueChange={(value) => handleAssetTypeChange(value as 'hardware' | 'software')} className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-2">
            <TabsTrigger value="hardware" className="flex items-center gap-2">
              <Computer className="h-4 w-4" />
              {language === 'th' ? 'ฮาร์ดแวร์' : 'Hardware'}
            </TabsTrigger>
            <TabsTrigger value="software" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              {language === 'th' ? 'ซอฟต์แวร์' : 'Software'}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      {/* Detail Category Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="details" className="flex items-center gap-2">
            <FileCheck className="h-4 w-4" />
            {language === 'th' ? 'รายละเอียด' : 'Details'}
          </TabsTrigger>
          <TabsTrigger value="ownership" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            {language === 'th' ? 'ประวัติการเป็นเจ้าของ' : 'Ownership'}
          </TabsTrigger>
          <TabsTrigger value="responsibility" className="flex items-center gap-2">
            <Contact className="h-4 w-4" />
            {language === 'th' ? 'ผู้รับผิดชอบ' : 'Responsibility'}
          </TabsTrigger>
          <TabsTrigger value="repairs" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            {language === 'th' ? 'ประวัติการซ่อม' : 'Repairs'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          {children.details}
        </TabsContent>
        
        <TabsContent value="ownership">
          {children.ownership || (
            <div className="text-center py-8 text-gray-500">
              {language === 'th' ? 'ไม่มีประวัติการเป็นเจ้าของ' : 'No ownership history available'}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="responsibility">
          {children.responsibility || (
            <div className="text-center py-8 text-gray-500">
              {language === 'th' ? 'ไม่มีข้อมูลผู้รับผิดชอบ' : 'No responsible parties available'}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="repairs">
          {children.repairs || (
            <div className="text-center py-8 text-gray-500">
              {language === 'th' ? 'ไม่มีประวัติการซ่อมบำรุง' : 'No repair history available'}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AssetManagementTabs;
