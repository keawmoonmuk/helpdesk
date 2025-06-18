
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { UserAsset } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { Loader2 } from 'lucide-react';
import apiClient from '@/services/api';
import { AssetManagementTabs } from './AssetManagementTabs';

// Extend UserAsset type for software properties
interface ExtendedUserAsset extends UserAsset {
  // Software specific properties
  version?: string;
  licenseCount?: number;
  developer?: string;
}

interface AssetDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  assetId: string | null;
}

export function AssetDetailsModal({ isOpen, onClose, assetId }: AssetDetailsModalProps) {
  const { language } = useLanguage();
  const [asset, setAsset] = useState<ExtendedUserAsset | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [assetType, setAssetType] = useState<'hardware' | 'software'>('hardware');

  useEffect(() => {
    const fetchAssetDetails = async () => {
      if (!assetId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const assetDetails = await apiClient.asset.getAssetById(assetId);
        setAsset(assetDetails);
        // Set initial asset type based on asset data
        if (assetDetails.assetCategory === 'software') {
          setAssetType('software');
        } else {
          setAssetType('hardware');
        }
      } catch (err) {
        console.error('Error fetching asset details:', err);
        setError(language === 'th' 
          ? 'ไม่สามารถโหลดข้อมูลทรัพย์สินได้' 
          : 'Failed to load asset details');
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && assetId) {
      fetchAssetDetails();
    } else {
      setAsset(null);
    }
  }, [isOpen, assetId, language]);

  const handleClose = () => {
    onClose();
  };

  // Handle asset type change
  const handleAssetTypeChange = (type: 'hardware' | 'software') => {
    setAssetType(type);
  };

  const renderTabContent = () => {
    if (!asset) return null;

    // Different content based on asset type
    const details = (
      <div className="space-y-4">
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
      </div>
    );

    return {
      details: details,
      ownership: asset.ownershipHistory && asset.ownershipHistory.length > 0 ? (
        <div className="space-y-4">
          {asset.ownershipHistory.map((record) => (
            <div key={record.id} className="border rounded-lg p-4 space-y-2">
              {/* ... keep existing code for ownership history display */}
              <div className="flex items-center gap-2 mb-2">
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
              </div>
            </div>
          ))}
        </div>
      ) : undefined,
      
      responsibility: asset.responsibleParties && asset.responsibleParties.length > 0 ? (
        <div className="space-y-4">
          {asset.responsibleParties.map((party) => (
            <div key={party.id} className="border rounded-lg p-4 space-y-2">
              {/* ... keep existing code for responsible parties display */}
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
                <div className="space-y-1">
                  <div className="text-xs text-gray-500">{language === 'th' ? 'ประเภท' : 'Type'}</div>
                  <div className="text-sm">{
                    party.type === 'department' ? (language === 'th' ? 'แผนก' : 'Department') :
                    party.type === 'employee' ? (language === 'th' ? 'พนักงาน' : 'Employee') :
                    (language === 'th' ? 'ไอที' : 'IT')
                  }</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : undefined,
      
      repairs: asset.repairHistory && asset.repairHistory.length > 0 ? (
        <div className="space-y-4">
          {asset.repairHistory.map((repair) => (
            <div key={repair.id} className="border rounded-lg p-4 space-y-2">
              {/* ... keep existing code for repair history display */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
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
              </div>
            </div>
          ))}
        </div>
      ) : undefined
    };
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat(language === 'th' ? 'th-TH' : 'en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }).format(date);
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {language === 'th' ? 'รายละเอียดทรัพย์สิน' : 'Asset Details'}
          </DialogTitle>
        </DialogHeader>

        {loading && (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-md text-center">
            {error}
          </div>
        )}

        {!loading && !error && asset && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">{asset.assetName}</h2>
              <span className="text-sm bg-gray-100 px-2 py-1 rounded">{asset.assetCode}</span>
            </div>
            
            <AssetManagementTabs 
              assetType={assetType} 
              onAssetTypeChange={handleAssetTypeChange}
              children={renderTabContent()}
            />
          </div>
        )}

        <DialogFooter>
          <Button onClick={handleClose}>
            {language === 'th' ? 'ปิด' : 'Close'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AssetDetailsModal;
