import { useState } from 'react';
import { UserAsset, RepairRecord, OwnershipRecord, ResponsibleParty } from '@/types';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Building, User, Clock, Calendar, FileCheck, Contact, History, Users
} from 'lucide-react';
import { format } from 'date-fns';

// Extended UserAsset type for software properties
interface ExtendedUserAsset extends UserAsset {
  // Software specific properties
  version?: string;
  licenseCount?: number;
  developer?: string;
}

interface AssetDetailsTabsProps {
  asset: ExtendedUserAsset; // Using ExtendedUserAsset instead of UserAsset
  assetType?: 'hardware' | 'software';
  onAssetTypeChange?: (type: 'hardware' | 'software') => void;
}

export function AssetDetailsTabs({ asset, assetType = 'hardware', onAssetTypeChange }: AssetDetailsTabsProps) {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState("details");

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return format(date, 'dd MMM yyyy');
    } catch (error) {
      return dateString;
    }
  };

  const getResponsiblePartyIcon = (type: string) => {
    switch (type) {
      case 'department':
        return <Building className="h-4 w-4 text-blue-500" />;
      case 'employee':
        return <User className="h-4 w-4 text-green-500" />;
      case 'it':
        return <User className="h-4 w-4 text-purple-500" />;
      default:
        return <Contact className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleAssetTypeChange = (type: 'hardware' | 'software') => {
    if (onAssetTypeChange) {
      onAssetTypeChange(type);
    }
  };

  return (
    <div className="space-y-4">
      {/* Asset Type Selection Tabs */}
      {onAssetTypeChange && (
        <Tabs value={assetType} onValueChange={(value) => handleAssetTypeChange(value as 'hardware' | 'software')} className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-2">
            <TabsTrigger value="hardware" className="flex items-center gap-2">
              <FileCheck className="h-4 w-4" />
              {language === 'th' ? 'ฮาร์ดแวร์' : 'Hardware'}
            </TabsTrigger>
            <TabsTrigger value="software" className="flex items-center gap-2">
              <FileCheck className="h-4 w-4" />
              {language === 'th' ? 'ซอฟต์แวร์' : 'Software'}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      {/* Detail Tabs */}
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

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm text-gray-500">{language === 'th' ? 'รหัสทรัพย์สิน' : 'Asset Code'}</div>
              <div className="font-medium">{asset.assetCode || '-'}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-gray-500">{language === 'th' ? 'สถานที่' : 'Location'}</div>
              <div className="font-medium">{asset.assetLocation || '-'}</div>
            </div>

            {/* Conditional fields based on asset type */}
            {assetType === 'hardware' && (
              <>
                <div className="space-y-2">
                  <div className="text-sm text-gray-500">{language === 'th' ? 'หมายเลขซีเรียล' : 'Serial Number'}</div>
                  <div className="font-medium">{asset.serialNumber || '-'}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-gray-500">{language === 'th' ? 'รุ่น' : 'Model'}</div>
                  <div className="font-medium">{asset.model || '-'}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-gray-500">{language === 'th' ? 'ผู้ผลิต' : 'Manufacturer'}</div>
                  <div className="font-medium">{asset.manufacturer || '-'}</div>
                </div>
              </>
            )}
          
            {assetType === 'software' && (
              <>
                <div className="space-y-2">
                  <div className="text-sm text-gray-500">{language === 'th' ? 'เวอร์ชัน' : 'Version'}</div>
                  <div className="font-medium">{asset.version || '-'}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-gray-500">{language === 'th' ? 'จำนวนลิขสิทธิ์' : 'License Count'}</div>
                  <div className="font-medium">{asset.licenseCount || '-'}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-gray-500">{language === 'th' ? 'ผู้พัฒนา' : 'Developer'}</div>
                  <div className="font-medium">{asset.developer || '-'}</div>
                </div>
              </>
            )}

            <div className="space-y-2">
              <div className="text-sm text-gray-500">{language === 'th' ? 'วันที่ซื้อ' : 'Purchase Date'}</div>
              <div className="font-medium">{asset.purchaseDate ? formatDate(asset.purchaseDate) : '-'}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-gray-500">{language === 'th' ? 'วันหมดอายุ' : 'Expiration Date'}</div>
              <div className="font-medium">{asset.expirationDate ? formatDate(asset.expirationDate) : '-'}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-gray-500">{language === 'th' ? 'สถานะ' : 'Status'}</div>
              <div className="font-medium">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  asset.status === 'active' ? 'bg-green-100 text-green-800' :
                  asset.status === 'expired' ? 'bg-gray-100 text-gray-800' :
                  asset.status === 'maintenance' ? 'bg-amber-100 text-amber-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {asset.status === 'active' && (language === 'th' ? 'ใช้งานอยู่' : 'Active')}
                  {asset.status === 'expired' && (language === 'th' ? 'ไม่ได้ใช้งาน' : 'Expired')}
                  {asset.status === 'maintenance' && (language === 'th' ? 'อยู่ระหว่างซ่อม' : 'Maintenance')}
                  {asset.status === 'decommissioned' && (language === 'th' ? 'ปลดระวาง' : 'Decommissioned')}
                </span>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Ownership History Tab */}
        <TabsContent value="ownership" className="space-y-4">
          {asset.ownershipHistory && asset.ownershipHistory.length > 0 ? (
            <div className="space-y-4">
              {asset.ownershipHistory.map((record: OwnershipRecord) => (
                <div key={record.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-indigo-500" />
                    <span className="text-sm font-medium">{formatDate(record.transferDate)}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500">{language === 'th' ? 'เจ้าของเดิม' : 'Previous Owner'}</div>
                      <div className="text-sm font-medium">{record.previousOwner}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500">{language === 'th' ? 'แผนกเดิม' : 'Previous Department'}</div>
                      <div className="text-sm font-medium">{record.previousDepartment}</div>
                    </div>
                    {record.reason && (
                      <div className="space-y-1 sm:col-span-2">
                        <div className="text-xs text-gray-500">{language === 'th' ? 'เหตุผล' : 'Reason'}</div>
                        <div className="text-sm">{record.reason}</div>
                      </div>
                    )}
                    {record.documentReference && (
                      <div className="space-y-1 sm:col-span-2">
                        <div className="text-xs text-gray-500">{language === 'th' ? 'เอกสารอ้างอิง' : 'Document Reference'}</div>
                        <div className="text-sm font-mono">{record.documentReference}</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {language === 'th' ? 'ไม่มีประวัติการเป็นเจ้าของ' : 'No ownership history available'}
            </div>
          )}
        </TabsContent>

        {/* Responsible Parties Tab */}
        <TabsContent value="responsibility" className="space-y-4">
          {asset.responsibleParties && asset.responsibleParties.length > 0 ? (
            <div className="space-y-4">
              {asset.responsibleParties.map((party: ResponsibleParty) => (
                <div key={party.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    {getResponsiblePartyIcon(party.type)}
                    <span className="text-sm font-medium">
                      {party.type === 'department' && (language === 'th' ? 'แผนก' : 'Department')}
                      {party.type === 'employee' && (language === 'th' ? 'พนักงาน' : 'Employee')}
                      {party.type === 'it' && (language === 'th' ? 'ไอที' : 'IT')}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500">{language === 'th' ? 'ชื่อ' : 'Name'}</div>
                      <div className="text-sm font-medium">{party.name}</div>
                    </div>
                    {party.email && (
                      <div className="space-y-1">
                        <div className="text-xs text-gray-500">{language === 'th' ? 'อีเมล' : 'Email'}</div>
                        <div className="text-sm">{party.email}</div>
                      </div>
                    )}
                    {party.phone && (
                      <div className="space-y-1">
                        <div className="text-xs text-gray-500">{language === 'th' ? 'โทรศัพท์' : 'Phone'}</div>
                        <div className="text-sm">{party.phone}</div>
                      </div>
                    )}
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500">{language === 'th' ? 'วันที่เริ่ม' : 'Start Date'}</div>
                      <div className="text-sm">{formatDate(party.startDate)}</div>
                    </div>
                    {party.endDate && (
                      <div className="space-y-1">
                        <div className="text-xs text-gray-500">{language === 'th' ? 'วันที่สิ้นสุด' : 'End Date'}</div>
                        <div className="text-sm">{formatDate(party.endDate)}</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {language === 'th' ? 'ไม่มีข้อมูลผู้รับผิดชอบ' : 'No responsible parties available'}
            </div>
          )}
        </TabsContent>

        {/* Repair History Tab */}
        <TabsContent value="repairs" className="space-y-4">
          {asset.repairHistory && asset.repairHistory.length > 0 ? (
            <div className="space-y-4">
              {asset.repairHistory.map((repair: RepairRecord) => (
                <div key={repair.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-amber-500" />
                      <span className="text-sm font-medium">{formatDate(repair.date)}</span>
                    </div>
                    {repair.status && (
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        repair.status === 'completed' ? 'bg-green-100 text-green-600' :
                        repair.status === 'in-progress' ? 'bg-blue-100 text-blue-600' :
                        'bg-yellow-100 text-yellow-600'
                      }`}>
                        {repair.status === 'completed' && (language === 'th' ? 'เสร็จสิ้น' : 'Completed')}
                        {repair.status === 'in-progress' && (language === 'th' ? 'กำลังดำเนินการ' : 'In Progress')}
                        {repair.status === 'pending' && (language === 'th' ? 'รอดำเนินการ' : 'Pending')}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="space-y-1 sm:col-span-2">
                      <div className="text-xs text-gray-500">{language === 'th' ? 'รายละเอียด' : 'Description'}</div>
                      <div className="text-sm">{repair.description}</div>
                    </div>
                    {repair.technician && (
                      <div className="space-y-1">
                        <div className="text-xs text-gray-500">{language === 'th' ? 'ช่างเทคนิค' : 'Technician'}</div>
                        <div className="text-sm">{repair.technician}</div>
                      </div>
                    )}
                    {repair.cost !== undefined && (
                      <div className="space-y-1">
                        <div className="text-xs text-gray-500">{language === 'th' ? 'ค่าใช้จ่าย' : 'Cost'}</div>
                        <div className="text-sm font-medium">
                          {new Intl.NumberFormat(language === 'th' ? 'th-TH' : 'en-US', { 
                            style: 'currency', 
                            currency: 'THB',
                            minimumFractionDigits: 0
                          }).format(repair.cost)}
                        </div>
                      </div>
                    )}
                  </div>
                  {repair.parts && repair.parts.length > 0 && (
                    <div className="mt-2">
                      <div className="text-xs text-gray-500">{language === 'th' ? 'อะไหล่ที่ใช้' : 'Parts Used'}</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {repair.parts.map((part, index) => (
                          <span key={index} className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">{part}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {language === 'th' ? 'ไม่มีประวัติการซ่อมบำรุง' : 'No repair history available'}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AssetDetailsTabs;
