
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { UserAsset } from '@/types';
import { 
  Plus, Computer, Printer, Server, Box, Pencil, Trash2, Calendar, 
  Users, Building, User, History, Contact, FileCheck, Clock, Eye
} from 'lucide-react';
import { toast } from 'sonner';
import AssetManagementModal from '@/components/AssetManagementModal';
import AssetDetailsModal from '@/components/asset/AssetDetailsModal';
import apiClient from '@/services/api';

const MyAssets = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [assets, setAssets] = useState<UserAsset[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<UserAsset | undefined>(undefined);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAssets = async () => {
      setIsLoading(true);
      try {
        if (user?.id) {
          const userAssets = await apiClient.asset.getUserAssets(user.id.toString());
          setAssets(userAssets);
        }
      } catch (error) {
        console.error('Error fetching assets:', error);
        toast.error(language === 'th' ? 'ไม่สามารถโหลดข้อมูลทรัพย์สินได้' : 'Failed to load assets');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssets();
  }, [user, language]);

  const handleDeleteAsset = async (id: string) => {
    try {
      await apiClient.asset.deleteAsset(id);
      setAssets(assets.filter(asset => asset.id !== id));
      toast.success(language === 'th' ? 'ลบทรัพย์สินเรียบร้อยแล้ว' : 'Asset deleted successfully');
    } catch (error) {
      console.error('Error deleting asset:', error);
      toast.error(language === 'th' ? 'ไม่สามารถลบทรัพย์สินได้' : 'Failed to delete asset');
    }
  };

  const openAddAssetModal = () => {
    setSelectedAsset(undefined);
    setIsModalOpen(true);
  };

  const openEditAssetModal = (asset: UserAsset) => {
    setSelectedAsset(asset);
    setIsModalOpen(true);
  };

  const openDetailsModal = (assetId: string) => {
    setSelectedAssetId(assetId);
    setIsDetailsModalOpen(true);
  };

  const handleAssetSave = async (asset: UserAsset) => {
    try {
      if (asset.id && assets.some(a => a.id === asset.id)) {
        // Update existing asset
        const updatedAsset = await apiClient.asset.updateAsset(asset.id, asset);
        setAssets(assets.map(a => a.id === asset.id ? updatedAsset : a));
        toast.success(language === 'th' ? 'อัปเดตทรัพย์สินเรียบร้อยแล้ว' : 'Asset updated successfully');
      } else {
        // Add new asset
        const newAsset = await apiClient.asset.addAsset({
          ...asset,
          userId: user?.id?.toString() || ''
        });
        setAssets([...assets, newAsset]);
        toast.success(language === 'th' ? 'เพิ่มทรัพย์สินเรียบร้อยแล้ว' : 'Asset added successfully');
      }
    } catch (error) {
      console.error('Error saving asset:', error);
      toast.error(language === 'th' ? 'ไม่สามารถบันทึกทรัพย์สินได้' : 'Failed to save asset');
    }
  };

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'computer':
        return <Computer className="h-10 w-10 text-blue-500" />;
      case 'printer':
        return <Printer className="h-10 w-10 text-green-500" />;
      case 'server':
        return <Server className="h-10 w-10 text-purple-500" />;
      default:
        return <Box className="h-10 w-10 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'th' ? 'th-TH' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysUntilExpiration = (expirationDate: string) => {
    if (!expirationDate) return null;
    
    const today = new Date();
    const expDate = new Date(expirationDate);
    const diffTime = expDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const renderExpirationStatus = (expirationDate: string) => {
    if (!expirationDate) return null;
    
    const daysLeft = getDaysUntilExpiration(expirationDate);
    
    if (daysLeft === null) return null;
    
    if (daysLeft <= 0) {
      return (
        <div className="mt-1 text-xs px-2 py-1 bg-red-100 text-red-600 rounded-full inline-flex items-center">
          <Calendar className="h-3 w-3 mr-1" />
          {language === 'th' ? 'หมดอายุแล้ว' : 'Expired'}
        </div>
      );
    } else if (daysLeft <= 30) {
      return (
        <div className="mt-1 text-xs px-2 py-1 bg-amber-100 text-amber-600 rounded-full inline-flex items-center">
          <Calendar className="h-3 w-3 mr-1" />
          {language === 'th' ? `เหลือ ${daysLeft} วัน` : `${daysLeft} days left`}
        </div>
      );
    } else {
      return (
        <div className="mt-1 text-xs px-2 py-1 bg-green-100 text-green-600 rounded-full inline-flex items-center">
          <Calendar className="h-3 w-3 mr-1" />
          {language === 'th' ? 'ยังไม่หมดอายุ' : 'Valid'}
        </div>
      );
    }
  };

  const hasRepairHistory = (asset: UserAsset) => {
    return asset.repairHistory && asset.repairHistory.length > 0;
  };

  const hasOwnershipHistory = (asset: UserAsset) => {
    return asset.ownershipHistory && asset.ownershipHistory.length > 0;
  };

  const hasResponsibleParties = (asset: UserAsset) => {
    return asset.responsibleParties && asset.responsibleParties.length > 0;
  };

  return (
    <DashboardLayout title={language === 'th' ? 'ทรัพย์สินของฉัน' : 'My Assets'}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{language === 'th' ? 'ทรัพย์สินที่ใช้งาน' : 'My Assets'}</h1>
        <Button onClick={openAddAssetModal}>
          <Plus className="h-4 w-4 mr-2" />
          {language === 'th' ? 'เพิ่มทรัพย์สิน' : 'Add Asset'}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : assets.length === 0 ? (
        <Card className="p-8 flex flex-col items-center justify-center text-center">
          <Box className="h-16 w-16 text-gray-300 mb-4" />
          <h2 className="text-xl font-medium mb-2">
            {language === 'th' ? 'ไม่พบทรัพย์สิน' : 'No Assets Found'}
          </h2>
          <p className="text-gray-500 mb-4">
            {language === 'th'
              ? 'คุณยังไม่มีทรัพย์สินในระบบ กรุณาเพิ่มทรัพย์สินเพื่อติดตามและจัดการได้'
              : 'You have no assets registered. Add assets to track and manage them.'}
          </p>
          <Button onClick={openAddAssetModal}>
            <Plus className="h-4 w-4 mr-2" />
            {language === 'th' ? 'เพิ่มทรัพย์สินตอนนี้' : 'Add Asset Now'}
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assets.map((asset) => (
            <Card key={asset.id} className="p-4">
              <div className="flex items-start">
                <div className="p-3 bg-gray-50 rounded-md mr-4">
                  {getAssetIcon(asset.assetType)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-lg">{asset.assetName}</h3>
                    <div className="flex space-x-2">
                      <Button 
                        size="icon" 
                        variant="ghost"
                        onClick={() => openDetailsModal(asset.id)}
                        title={language === 'th' ? 'ดูรายละเอียด' : 'View Details'}
                      >
                        <Eye className="h-4 w-4 text-gray-500" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost"
                        onClick={() => openEditAssetModal(asset)}
                        title={language === 'th' ? 'แก้ไข' : 'Edit'}
                      >
                        <Pencil className="h-4 w-4 text-gray-500" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="text-red-500"
                        onClick={() => handleDeleteAsset(asset.id)}
                        title={language === 'th' ? 'ลบ' : 'Delete'}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm">{asset.assetCode}</p>
                  
                  <div className="flex gap-1 mt-1 flex-wrap">
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
                      {asset.assetType === 'computer' && (language === 'th' ? 'คอมพิวเตอร์' : 'Computer')}
                      {asset.assetType === 'printer' && (language === 'th' ? 'เครื่องพิมพ์' : 'Printer')}
                      {asset.assetType === 'server' && (language === 'th' ? 'เซิร์ฟเวอร์' : 'Server')}
                      {asset.assetType === 'other' && (language === 'th' ? 'อื่นๆ' : 'Other')}
                    </span>
                    <span className="text-xs px-2 py-1 bg-purple-100 text-purple-600 rounded-full">
                      {asset.assetCategory === 'hardware' && (language === 'th' ? 'ฮาร์ดแวร์' : 'Hardware')}
                      {asset.assetCategory === 'software' && (language === 'th' ? 'ซอฟต์แวร์' : 'Software')}
                      {asset.assetCategory === 'network' && (language === 'th' ? 'เครือข่าย' : 'Network')}
                      {asset.assetCategory === 'other' && (language === 'th' ? 'อื่นๆ' : 'Other')}
                    </span>
                    {asset.expirationDate && renderExpirationStatus(asset.expirationDate)}
                    
                    {hasOwnershipHistory(asset) && (
                      <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-600 rounded-full flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {language === 'th' ? 'มีประวัติการโอน' : 'Transfer history'}
                      </span>
                    )}
                    
                    {hasResponsibleParties(asset) && (
                      <span className="text-xs px-2 py-1 bg-cyan-100 text-cyan-600 rounded-full flex items-center">
                        <Contact className="h-3 w-3 mr-1" />
                        {language === 'th' ? 'ผู้รับผิดชอบ' : 'Responsible'}
                      </span>
                    )}
                    
                    {hasRepairHistory(asset) && (
                      <span className="text-xs px-2 py-1 bg-amber-100 text-amber-600 rounded-full flex items-center">
                        <History className="h-3 w-3 mr-1" />
                        {language === 'th' ? 'เคยซ่อมแล้ว' : 'Repaired'}
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-gray-500">{language === 'th' ? 'ตำแหน่ง' : 'Location'}</p>
                      <p className="text-sm">{asset.assetLocation}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{language === 'th' ? 'Serial' : 'Serial Number'}</p>
                      <p className="text-sm">{asset.serialNumber}</p>
                    </div>
                    {asset.expirationDate && (
                      <div>
                        <p className="text-xs text-gray-500">{language === 'th' ? 'วันหมดอายุ' : 'Expiration Date'}</p>
                        <p className="text-sm">{formatDate(asset.expirationDate)}</p>
                      </div>
                    )}
                    {asset.model && (
                      <div>
                        <p className="text-xs text-gray-500">{language === 'th' ? 'รุ่น' : 'Model'}</p>
                        <p className="text-sm">{asset.model}</p>
                      </div>
                    )}
                    {asset.manufacturer && (
                      <div>
                        <p className="text-xs text-gray-500">{language === 'th' ? 'ผู้ผลิต' : 'Manufacturer'}</p>
                        <p className="text-sm">{asset.manufacturer}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Legacy Ownership and Responsibility Information */}
                  <div className="mt-4 border-t pt-3">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      {asset.responsibleDepartment && (
                        <div className="flex items-start">
                          <Building className="h-4 w-4 text-gray-400 mt-0.5 mr-1.5" />
                          <div>
                            <p className="text-xs text-gray-500">{language === 'th' ? 'แผนกที่รับผิดชอบ' : 'Responsible Dept.'}</p>
                            <p className="text-sm">{asset.responsibleDepartment}</p>
                          </div>
                        </div>
                      )}
                      
                      {asset.responsibleEmployee && (
                        <div className="flex items-start">
                          <User className="h-4 w-4 text-gray-400 mt-0.5 mr-1.5" />
                          <div>
                            <p className="text-xs text-gray-500">{language === 'th' ? 'พนักงานที่รับผิดชอบ' : 'Responsible Employee'}</p>
                            <p className="text-sm">{asset.responsibleEmployee}</p>
                          </div>
                        </div>
                      )}
                      
                      {asset.previousOwner && (
                        <div className="flex items-start">
                          <Users className="h-4 w-4 text-gray-400 mt-0.5 mr-1.5" />
                          <div>
                            <p className="text-xs text-gray-500">{language === 'th' ? 'ผู้ใช้งานก่อนหน้า' : 'Previous Owner'}</p>
                            <p className="text-sm">{asset.previousOwner}</p>
                          </div>
                        </div>
                      )}
                      
                      {asset.acquisitionDate && (
                        <div className="flex items-start">
                          <Calendar className="h-4 w-4 text-gray-400 mt-0.5 mr-1.5" />
                          <div>
                            <p className="text-xs text-gray-500">{language === 'th' ? 'วันที่ได้รับ' : 'Acquired On'}</p>
                            <p className="text-sm">{formatDate(asset.acquisitionDate)}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Asset Management Modal */}
      {isModalOpen && (
        <AssetManagementModal
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleAssetSave}
          initialAsset={selectedAsset}
        />
      )}

      {/* Asset Details Modal with Tabs */}
      <AssetDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        assetId={selectedAssetId}
      />
    </DashboardLayout>
  );
};

export default MyAssets;
