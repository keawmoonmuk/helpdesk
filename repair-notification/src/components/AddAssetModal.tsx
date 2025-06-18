
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { X, Laptop, Printer, Server, Package, FileText, Shield, Code, Globe, AlertCircle, Calendar, Clock, Users, Building, User, History, Contact } from 'lucide-react';
import { Button } from './ui/button';
import { UserAsset, RepairRecord } from '@/types';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

export interface AddAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (asset?: UserAsset) => void;
  onAddAsset: (assetData: any) => Promise<void>;
  initialAsset?: UserAsset;
}

const AddAssetModal : React.FC<AddAssetModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialAsset
}) => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'hardware' | 'software'>('hardware');
  const [secondaryTab, setSecondaryTab] = useState<'details' | 'ownership' | 'responsibility' | 'repairs'>('details');
  const [assetName, setAssetName] = useState('');
  const [assetCode, setAssetCode] = useState('');
  const [assetSerial, setAssetSerial] = useState('');
  const [assetLocation, setAssetLocation] = useState('');
  const [assetType, setAssetType] = useState<'computer' | 'printer' | 'server' | 'other'>('computer');
  const [assetCategory, setAssetCategory] = useState<'hardware' | 'software' | 'network' | 'other'>('hardware');
  const [softwareType, setSoftwareType] = useState<'operating-system' | 'office' | 'design' | 'security' | 'development' | 'other'>('operating-system');
  const [model, setModel] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [licenseKey, setLicenseKey] = useState('');
  const [licenseSeats, setLicenseSeats] = useState<number | ''>('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<'active' | 'expired' | 'maintenance' | 'decommissioned'>('active');
  const [warrantyExpiryDate, setWarrantyExpiryDate] = useState('');
  const [maintenanceExpiryDate, setMaintenanceExpiryDate] = useState('');
  
  // New fields for previous ownership
  const [previousOwner, setPreviousOwner] = useState('');
  const [previousDepartment, setPreviousDepartment] = useState('');
  const [acquisitionDate, setAcquisitionDate] = useState('');
  
  // New fields for responsibility
  const [responsibleDepartment, setResponsibleDepartment] = useState('');
  const [responsibleEmployee, setResponsibleEmployee] = useState('');
  const [responsibleIT, setResponsibleIT] = useState('');
  
  // Repair history
  const [repairHistory, setRepairHistory] = useState<RepairRecord[]>([]);
  const [newRepairDate, setNewRepairDate] = useState('');
  const [newRepairDescription, setNewRepairDescription] = useState('');
  const [newRepairCost, setNewRepairCost] = useState<number | ''>('');
  const [newRepairTechnician, setNewRepairTechnician] = useState('');
  const [isAddingRepair, setIsAddingRepair] = useState(false);
  
  useEffect(() => {
    if (initialAsset) {
      setAssetName(initialAsset.assetName || '');
      setAssetCode(initialAsset.assetCode || '');
      setAssetSerial(initialAsset.serialNumber || '');
      setAssetLocation(initialAsset.assetLocation || '');
      setAssetType(initialAsset.assetType || 'computer');
      setAssetCategory(initialAsset.assetCategory || 'hardware');
      setSoftwareType(initialAsset.softwareType || 'operating-system');
      setModel(initialAsset.model || '');
      setManufacturer(initialAsset.manufacturer || '');
      setPurchaseDate(initialAsset.purchaseDate || '');
      setExpirationDate(initialAsset.expirationDate || '');
      setLicenseKey(initialAsset.licenseKey || '');
      setLicenseSeats(initialAsset.licenseSeats || '');
      setNotes(initialAsset.notes || '');
      setStatus(initialAsset.status || 'active');
      setWarrantyExpiryDate(initialAsset.warrantyExpiryDate || '');
      setMaintenanceExpiryDate(initialAsset.maintenanceExpiryDate || '');
      setActiveTab(initialAsset.assetCategory === 'software' ? 'software' : 'hardware');
      
      // Set previous ownership data
      setPreviousOwner(initialAsset.previousOwner || '');
      setPreviousDepartment(initialAsset.previousDepartment || '');
      setAcquisitionDate(initialAsset.acquisitionDate || '');
      
      // Set responsibility data
      setResponsibleDepartment(initialAsset.responsibleDepartment || '');
      setResponsibleEmployee(initialAsset.responsibleEmployee || '');
      setResponsibleIT(initialAsset.responsibleIT || '');
      
      // Set repair history
      setRepairHistory(initialAsset.repairHistory || []);
    }
  }, [initialAsset]);

  useEffect(() => {
    if (activeTab === 'hardware') {
      setAssetCategory('hardware');
    } else {
      setAssetCategory('software');
    }
  }, [activeTab]);

  const calculateDaysRemaining = (expiryDate: string): number | null => {
    if (!expiryDate) return null;
    
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const getExpiryStatusColor = (daysRemaining: number | null): string => {
    if (daysRemaining === null) return 'bg-gray-100 text-gray-600';
    if (daysRemaining <= 0) return 'bg-red-100 text-red-600';
    if (daysRemaining <= 30) return 'bg-amber-100 text-amber-600';
    return 'bg-green-100 text-green-600';
  };

  const handleAddRepair = () => {
    if (!newRepairDate || !newRepairDescription) return;
    
    const newRepair: RepairRecord = {
      id: Date.now().toString(),
      date: newRepairDate,
      description: newRepairDescription,
      cost: newRepairCost === '' ? undefined : Number(newRepairCost),
      technician: newRepairTechnician || undefined
    };
    
    setRepairHistory([...repairHistory, newRepair]);
    setNewRepairDate('');
    setNewRepairDescription('');
    setNewRepairCost('');
    setNewRepairTechnician('');
    setIsAddingRepair(false);
  };

  const handleRemoveRepair = (id: string) => {
    setRepairHistory(repairHistory.filter(repair => repair.id !== id));
  };

  const handleSubmit = () => {
    const newAsset: UserAsset = {
      id: initialAsset?.id || Date.now().toString(),
      userId: initialAsset?.userId || 'unknown',
      assetName,
      assetCode,
      assetLocation,
      serialNumber: assetSerial,
      assetType: activeTab === 'software' ? 'other' : assetType,
      assetCategory,
      model,
      manufacturer,
      purchaseDate,
      expirationDate,
      softwareType: activeTab === 'software' ? softwareType : undefined,
      licenseKey: activeTab === 'software' ? licenseKey : undefined,
      licenseSeats: activeTab === 'software' && licenseSeats !== '' ? Number(licenseSeats) : undefined,
      notes,
      status,
      warrantyExpiryDate: activeTab === 'hardware' ? warrantyExpiryDate : undefined,
      maintenanceExpiryDate: activeTab === 'hardware' ? maintenanceExpiryDate : undefined,
      // Add new fields
      previousOwner,
      previousDepartment,
      acquisitionDate,
      responsibleDepartment,
      responsibleEmployee,
      responsibleIT,
      repairHistory
    };
    onSuccess(newAsset);
    onClose();
  };

  const getSoftwareTypeIcon = (type: string) => {
    switch (type) {
      case 'operating-system': return <Globe className="h-5 w-5" />;
      case 'office': return <FileText className="h-5 w-5" />;
      case 'design': return <Laptop className="h-5 w-5" />;
      case 'security': return <Shield className="h-5 w-5" />;
      case 'development': return <Code className="h-5 w-5" />;
      default: return <Package className="h-5 w-5" />;
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 pb-3 border-b">
          <h3 className="text-xl font-semibold text-blue-800">
            {language === 'th' ? 'จัดการทรัพย์สิน' : 'Manage Asset'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as 'hardware' | 'software')}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="hardware" className="flex items-center gap-2">
              <Laptop className="h-4 w-4" />
              {language === 'th' ? 'ฮาร์ดแวร์' : 'Hardware'}
            </TabsTrigger>
            <TabsTrigger value="software" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {language === 'th' ? 'ซอฟต์แวร์' : 'Software'}
            </TabsTrigger>
          </TabsList>

          {/* Secondary tabs for different sections */}
          <div className="mb-4">
            <TabsList className="w-full flex overflow-x-auto space-x-1">
              <TabsTrigger 
                value="details" 
                onClick={() => setSecondaryTab('details')}
                className={secondaryTab === 'details' ? 'border-b-2 border-blue-500' : ''}
              >
                {language === 'th' ? 'รายละเอียด' : 'Details'}
              </TabsTrigger>
              <TabsTrigger 
                value="ownership" 
                onClick={() => setSecondaryTab('ownership')}
                className={secondaryTab === 'ownership' ? 'border-b-2 border-blue-500' : ''}
              >
                <Users className="h-4 w-4 mr-1" />
                {language === 'th' ? 'ประวัติการถือครอง' : 'Ownership History'}
              </TabsTrigger>
              <TabsTrigger 
                value="responsibility" 
                onClick={() => setSecondaryTab('responsibility')}
                className={secondaryTab === 'responsibility' ? 'border-b-2 border-blue-500' : ''}
              >
                <Contact className="h-4 w-4 mr-1" />
                {language === 'th' ? 'ผู้รับผิดชอบ' : 'Responsibility'}
              </TabsTrigger>
              <TabsTrigger 
                value="repairs" 
                onClick={() => setSecondaryTab('repairs')}
                className={secondaryTab === 'repairs' ? 'border-b-2 border-blue-500' : ''}
              >
                <History className="h-4 w-4 mr-1" />
                {language === 'th' ? 'ประวัติการซ่อม' : 'Repair History'}
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Hardware Tab */}
          <TabsContent value="hardware" className="space-y-4">
            {secondaryTab === 'details' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="assetName">{language === 'th' ? 'ชื่อทรัพย์สิน' : 'Asset Name'}</Label>
                    <Input
                      id="assetName"
                      value={assetName}
                      onChange={(e) => setAssetName(e.target.value)}
                      placeholder={language === 'th' ? 'เช่น คอมพิวเตอร์' : 'e.g. Computer'}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="assetCode">{language === 'th' ? 'รหัสทรัพย์สิน' : 'Asset Code'}</Label>
                    <Input
                      id="assetCode"
                      value={assetCode}
                      onChange={(e) => setAssetCode(e.target.value)}
                      placeholder={language === 'th' ? 'เช่น PC-001' : 'e.g. PC-001'}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label>{language === 'th' ? 'ประเภท' : 'Type'}</Label>
                  <div className="grid grid-cols-4 gap-3 mt-1">
                    <button
                      type="button"
                      onClick={() => setAssetType('computer')}
                      className={cn("flex flex-col items-center justify-center p-3 rounded-md border", 
                        assetType === 'computer' ? "border-blue-500 bg-blue-50" : "border-gray-200")}
                    >
                      <Laptop className={cn("h-6 w-6 mb-1", assetType === 'computer' ? "text-blue-500" : "text-gray-500")} />
                      <span className="text-sm">{language === 'th' ? 'คอมพิวเตอร์' : 'Computer'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAssetType('printer')}
                      className={cn("flex flex-col items-center justify-center p-3 rounded-md border", 
                        assetType === 'printer' ? "border-blue-500 bg-blue-50" : "border-gray-200")}
                    >
                      <Printer className={cn("h-6 w-6 mb-1", assetType === 'printer' ? "text-blue-500" : "text-gray-500")} />
                      <span className="text-sm">{language === 'th' ? 'เครื่องพิมพ์' : 'Printer'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAssetType('server')}
                      className={cn("flex flex-col items-center justify-center p-3 rounded-md border", 
                        assetType === 'server' ? "border-blue-500 bg-blue-50" : "border-gray-200")}
                    >
                      <Server className={cn("h-6 w-6 mb-1", assetType === 'server' ? "text-blue-500" : "text-gray-500")} />
                      <span className="text-sm">{language === 'th' ? 'เซิร์ฟเวอร์' : 'Server'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAssetType('other')}
                      className={cn("flex flex-col items-center justify-center p-3 rounded-md border", 
                        assetType === 'other' ? "border-blue-500 bg-blue-50" : "border-gray-200")}
                    >
                      <Package className={cn("h-6 w-6 mb-1", assetType === 'other' ? "text-blue-500" : "text-gray-500")} />
                      <span className="text-sm">{language === 'th' ? 'อื่นๆ' : 'Other'}</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="serialNumber">{language === 'th' ? 'หมายเลขซีเรียล' : 'Serial Number'}</Label>
                    <Input
                      id="serialNumber"
                      value={assetSerial}
                      onChange={(e) => setAssetSerial(e.target.value)}
                      placeholder={language === 'th' ? 'เช่น SN12345' : 'e.g. SN12345'}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="assetLocation">{language === 'th' ? 'สถานที่' : 'Location'}</Label>
                    <Input
                      id="assetLocation"
                      value={assetLocation}
                      onChange={(e) => setAssetLocation(e.target.value)}
                      placeholder={language === 'th' ? 'เช่น สำนักงานใหญ่' : 'e.g. Head Office'}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="manufacturer">{language === 'th' ? 'ผู้ผลิต' : 'Manufacturer'}</Label>
                    <Input
                      id="manufacturer"
                      value={manufacturer}
                      onChange={(e) => setManufacturer(e.target.value)}
                      placeholder={language === 'th' ? 'เช่น HP, Dell' : 'e.g. HP, Dell'}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="model">{language === 'th' ? 'รุ่น' : 'Model'}</Label>
                    <Input
                      id="model"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      placeholder={language === 'th' ? 'เช่น Latitude 5420' : 'e.g. Latitude 5420'}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="purchaseDate">{language === 'th' ? 'วันที่ซื้อ' : 'Purchase Date'}</Label>
                    <Input
                      id="purchaseDate"
                      type="date"
                      value={purchaseDate}
                      onChange={(e) => setPurchaseDate(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="warrantyExpiryDate" className="flex items-center">
                      {language === 'th' ? 'วันหมดประกัน' : 'Warranty Expiry'}
                      {warrantyExpiryDate && (
                        <span className={cn("ml-2 text-xs px-2 py-0.5 rounded-full inline-flex items-center", 
                          getExpiryStatusColor(calculateDaysRemaining(warrantyExpiryDate)))}>
                          <Clock className="h-3 w-3 mr-1" />
                          {calculateDaysRemaining(warrantyExpiryDate) || 0} {language === 'th' ? 'วัน' : 'days'}
                        </span>
                      )}
                    </Label>
                    <Input
                      id="warrantyExpiryDate"
                      type="date"
                      value={warrantyExpiryDate}
                      onChange={(e) => setWarrantyExpiryDate(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maintenanceExpiryDate" className="flex items-center">
                      {language === 'th' ? 'วันหมดสัญญาดูแล' : 'Maintenance Expiry'}
                      {maintenanceExpiryDate && (
                        <span className={cn("ml-2 text-xs px-2 py-0.5 rounded-full inline-flex items-center", 
                          getExpiryStatusColor(calculateDaysRemaining(maintenanceExpiryDate)))}>
                          <Clock className="h-3 w-3 mr-1" />
                          {calculateDaysRemaining(maintenanceExpiryDate) || 0} {language === 'th' ? 'วัน' : 'days'}
                        </span>
                      )}
                    </Label>
                    <Input
                      id="maintenanceExpiryDate"
                      type="date"
                      value={maintenanceExpiryDate}
                      onChange={(e) => setMaintenanceExpiryDate(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="status">{language === 'th' ? 'สถานะ' : 'Status'}</Label>
                  <Select 
                    value={status} 
                    onValueChange={(value) => setStatus(value as 'active' | 'expired' | 'maintenance' | 'decommissioned')}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder={language === 'th' ? 'เลือกสถานะ' : 'Select status'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">{language === 'th' ? 'ใช้งานอยู่' : 'Active'}</SelectItem>
                      <SelectItem value="maintenance">{language === 'th' ? 'อยู่ระหว่างซ่อมบำรุง' : 'Under Maintenance'}</SelectItem>
                      <SelectItem value="expired">{language === 'th' ? 'หมดอายุ' : 'Expired'}</SelectItem>
                      <SelectItem value="decommissioned">{language === 'th' ? 'ปลดระวาง' : 'Decommissioned'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="notes">{language === 'th' ? 'บันทึกเพิ่มเติม' : 'Notes'}</Label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 mt-1"
                    rows={3}
                    placeholder={language === 'th' ? 'บันทึกเพิ่มเติม...' : 'Additional notes...'}
                  />
                </div>
              </>
            )}

            {secondaryTab === 'ownership' && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800">
                  {language === 'th' ? 'ประวัติการถือครอง' : 'Ownership History'}
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="previousOwner">
                      {language === 'th' ? 'เจ้าของก่อนหน้า' : 'Previous Owner'}
                    </Label>
                    <Input
                      id="previousOwner"
                      value={previousOwner}
                      onChange={(e) => setPreviousOwner(e.target.value)}
                      placeholder={language === 'th' ? 'เช่น แผนกการเงิน' : 'e.g. Finance Department'}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="previousDepartment">
                      {language === 'th' ? 'หน่วยงานก่อนหน้า' : 'Previous Department'}
                    </Label>
                    <Input
                      id="previousDepartment"
                      value={previousDepartment}
                      onChange={(e) => setPreviousDepartment(e.target.value)}
                      placeholder={language === 'th' ? 'เช่น ฝ่ายบัญชี' : 'e.g. Accounting'}
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="acquisitionDate">
                    {language === 'th' ? 'วันที่ได้รับการส่งมอบ' : 'Acquisition Date'}
                  </Label>
                  <Input
                    id="acquisitionDate"
                    type="date"
                    value={acquisitionDate}
                    onChange={(e) => setAcquisitionDate(e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div className="bg-blue-50 p-3 rounded-md">
                  <div className="flex items-start">
                    <Users className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
                    <div>
                      <h4 className="font-medium text-blue-800">
                        {language === 'th' ? 'ข้อมูลการเปลี่ยนเจ้าของ' : 'Ownership Transfer Information'}
                      </h4>
                      <p className="text-sm text-blue-600">
                        {language === 'th' 
                          ? 'บันทึกข้อมูลผู้ดูแลหรือหน่วยงานที่เคยเป็นเจ้าของทรัพย์สินนี้ก่อนหน้า เพื่อการติดตามประวัติการใช้งาน'
                          : 'Record information about previous owners or departments that managed this asset to track usage history'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {secondaryTab === 'responsibility' && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800">
                  {language === 'th' ? 'ผู้รับผิดชอบ' : 'Responsible Parties'}
                </h3>
                
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="responsibleDepartment">
                      <Building className="h-4 w-4 inline mr-1" />
                      {language === 'th' ? 'หน่วยงานที่รับผิดชอบ' : 'Responsible Department'}
                    </Label>
                    <Input
                      id="responsibleDepartment"
                      value={responsibleDepartment}
                      onChange={(e) => setResponsibleDepartment(e.target.value)}
                      placeholder={language === 'th' ? 'เช่น ฝ่ายเทคโนโลยีสารสนเทศ' : 'e.g. IT Department'}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="responsibleEmployee">
                      <User className="h-4 w-4 inline mr-1" />
                      {language === 'th' ? 'พนักงานผู้รับผิดชอบ' : 'Responsible Employee'}
                    </Label>
                    <Input
                      id="responsibleEmployee"
                      value={responsibleEmployee}
                      onChange={(e) => setResponsibleEmployee(e.target.value)}
                      placeholder={language === 'th' ? 'เช่น นายสมชาย ใจดี' : 'e.g. John Doe'}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="responsibleIT">
                      <Laptop className="h-4 w-4 inline mr-1" />
                      {language === 'th' ? 'เจ้าหน้าที่ IT ผู้ดูแล' : 'IT Support Contact'}
                    </Label>
                    <Input
                      id="responsibleIT"
                      value={responsibleIT}
                      onChange={(e) => setResponsibleIT(e.target.value)}
                      placeholder={language === 'th' ? 'เช่น นายวิชัย ช่างซ่อม' : 'e.g. Jane Smith'}
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div className="bg-purple-50 p-3 rounded-md">
                  <div className="flex items-start">
                    <Contact className="h-5 w-5 text-purple-500 mt-0.5 mr-2" />
                    <div>
                      <h4 className="font-medium text-purple-800">
                        {language === 'th' ? 'ข้อมูลผู้รับผิดชอบ' : 'Responsibility Information'}
                      </h4>
                      <p className="text-sm text-purple-600">
                        {language === 'th' 
                          ? 'ระบุผู้รับผิดชอบทรัพย์สินนี้เพื่อการติดตามและดูแลรักษา หากพบปัญหาสามารถติดต่อบุคคลเหล่านี้ได้'
                          : 'Specify who is responsible for this asset for tracking and maintenance. These contacts can be reached if issues arise.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {secondaryTab === 'repairs' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-800">
                    {language === 'th' ? 'ประวัติการซ่อมและปรับปรุง' : 'Repair and Improvement History'}
                  </h3>
                  
                  <Button 
                    type="button" 
                    onClick={() => setIsAddingRepair(true)}
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1"
                  >
                    <span className="text-xs">+</span>
                    {language === 'th' ? 'เพิ่มประวัติการซ่อม' : 'Add Repair Record'}
                  </Button>
                </div>
                
                {isAddingRepair && (
                  <div className="border p-3 rounded-md bg-gray-50">
                    <h4 className="font-medium mb-3">
                      {language === 'th' ? 'เพิ่มประวัติการซ่อม/ปรับปรุงใหม่' : 'Add New Repair/Improvement Record'}
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <Label htmlFor="repairDate">
                          {language === 'th' ? 'วันที่ซ่อม' : 'Repair Date'}
                        </Label>
                        <Input
                          id="repairDate"
                          type="date"
                          value={newRepairDate}
                          onChange={(e) => setNewRepairDate(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="repairCost">
                          {language === 'th' ? 'ค่าใช้จ่าย' : 'Cost'}
                        </Label>
                        <Input
                          id="repairCost"
                          type="number"
                          value={newRepairCost}
                          onChange={(e) => setNewRepairCost(e.target.value === '' ? '' : Number(e.target.value))}
                          placeholder={language === 'th' ? 'เช่น 2000' : 'e.g. 2000'}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <Label htmlFor="repairDescription">
                        {language === 'th' ? 'รายละเอียดการซ่อม/ปรับปรุง' : 'Repair/Improvement Details'}
                      </Label>
                      <textarea
                        id="repairDescription"
                        value={newRepairDescription}
                        onChange={(e) => setNewRepairDescription(e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2 mt-1"
                        rows={2}
                        placeholder={language === 'th' ? 'อธิบายการซ่อมหรือปรับปรุง...' : 'Describe the repair or improvement...'}
                      />
                    </div>
                    
                    <div className="mb-3">
                      <Label htmlFor="repairTechnician">
                        {language === 'th' ? 'ช่างเทคนิค/ผู้ดำเนินการ' : 'Technician/Performed by'}
                      </Label>
                      <Input
                        id="repairTechnician"
                        value={newRepairTechnician}
                        onChange={(e) => setNewRepairTechnician(e.target.value)}
                        placeholder={language === 'th' ? 'เช่น นายช่างใจดี' : 'e.g. John the Technician'}
                        className="mt-1"
                      />
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button 
                        type="button" 
                        onClick={() => setIsAddingRepair(false)}
                        variant="outline"
                        size="sm"
                      >
                        {language === 'th' ? 'ยกเลิก' : 'Cancel'}
                      </Button>
                      <Button 
                        type="button" 
                        onClick={handleAddRepair}
                        size="sm"
                      >
                        {language === 'th' ? 'เพิ่ม' : 'Add'}
                      </Button>
                    </div>
                  </div>
                )}
                
                {repairHistory.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-md border border-dashed">
                    <History className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">
                      {language === 'th' ? 'ยังไม่มีประวัติการซ่อมหรือปรับปรุง' : 'No repair or improvement history yet'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {repairHistory.map((repair) => (
                      <div key={repair.id} className="border rounded-md p-3 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <span className="bg-blue-100 text-blue-800 text-xs py-1 px-2 rounded">
                              {new Date(repair.date).toLocaleDateString(language === 'th' ? 'th-TH' : 'en-US')}
                            </span>
                            {repair.cost && (
                              <span className="bg-green-100 text-green-800 text-xs py-1 px-2 rounded">
                                {new Intl.NumberFormat(language === 'th' ? 'th-TH' : 'en-US', { 
                                  style: 'currency', 
                                  currency: 'THB',
                                  minimumFractionDigits: 0
                                }).format(repair.cost)}
                              </span>
                            )}
                          </div>
                          <button 
                            type="button" 
                            onClick={() => handleRemoveRepair(repair.id)}
                            className="text-red-500 hover:text-red-700 text-xs"
                          >
                            {language === 'th' ? 'ลบ' : 'Remove'}
                          </button>
                        </div>
                        <p className="text-sm mt-2">{repair.description}</p>
                        {repair.technician && (
                          <p className="text-xs text-gray-500 mt-1">
                            {language === 'th' ? 'ดำเนินการโดย: ' : 'Performed by: '}
                            {repair.technician}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* Software Tab - identical structure with software specific fields */}
          <TabsContent value="software" className="space-y-4">
            {secondaryTab === 'details' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="softwareName">{language === 'th' ? 'ชื่อซอฟต์แวร์' : 'Software Name'}</Label>
                    <Input
                      id="softwareName"
                      value={assetName}
                      onChange={(e) => setAssetName(e.target.value)}
                      placeholder={language === 'th' ? 'เช่น Microsoft Office' : 'e.g. Microsoft Office'}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="softwareCode">{language === 'th' ? 'รหัสซอฟต์แวร์' : 'Software Code'}</Label>
                    <Input
                      id="softwareCode"
                      value={assetCode}
                      onChange={(e) => setAssetCode(e.target.value)}
                      placeholder={language === 'th' ? 'เช่น SW-001' : 'e.g. SW-001'}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label>{language === 'th' ? 'ประเภทซอฟต์แวร์' : 'Software Type'}</Label>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mt-1">
                    <button
                      type="button"
                      onClick={() => setSoftwareType('operating-system')}
                      className={cn("flex flex-col items-center justify-center p-3 rounded-md border", 
                        softwareType === 'operating-system' ? "border-blue-500 bg-blue-50" : "border-gray-200")}
                    >
                      <Globe className={cn("h-6 w-6 mb-1", softwareType === 'operating-system' ? "text-blue-500" : "text-gray-500")} />
                      <span className="text-xs">{language === 'th' ? 'ระบบปฏิบัติการ' : 'OS'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSoftwareType('office')}
                      className={cn("flex flex-col items-center justify-center p-3 rounded-md border", 
                        softwareType === 'office' ? "border-blue-500 bg-blue-50" : "border-gray-200")}
                    >
                      <FileText className={cn("h-6 w-6 mb-1", softwareType === 'office' ? "text-blue-500" : "text-gray-500")} />
                      <span className="text-xs">{language === 'th' ? 'ออฟฟิศ' : 'Office'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSoftwareType('design')}
                      className={cn("flex flex-col items-center justify-center p-3 rounded-md border", 
                        softwareType === 'design' ? "border-blue-500 bg-blue-50" : "border-gray-200")}
                    >
                      <Laptop className={cn("h-6 w-6 mb-1", softwareType === 'design' ? "text-blue-500" : "text-gray-500")} />
                      <span className="text-xs">{language === 'th' ? 'ออกแบบ' : 'Design'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSoftwareType('security')}
                      className={cn("flex flex-col items-center justify-center p-3 rounded-md border", 
                        softwareType === 'security' ? "border-blue-500 bg-blue-50" : "border-gray-200")}
                    >
                      <Shield className={cn("h-6 w-6 mb-1", softwareType === 'security' ? "text-blue-500" : "text-gray-500")} />
                      <span className="text-xs">{language === 'th' ? 'ความปลอดภัย' : 'Security'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSoftwareType('development')}
                      className={cn("flex flex-col items-center justify-center p-3 rounded-md border", 
                        softwareType === 'development' ? "border-blue-500 bg-blue-50" : "border-gray-200")}
                    >
                      <Code className={cn("h-6 w-6 mb-1", softwareType === 'development' ? "text-blue-500" : "text-gray-500")} />
                      <span className="text-xs">{language === 'th' ? 'พัฒนา' : 'Development'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSoftwareType('other')}
                      className={cn("flex flex-col items-center justify-center p-3 rounded-md border", 
                        softwareType === 'other' ? "border-blue-500 bg-blue-50" : "border-gray-200")}
                    >
                      <Package className={cn("h-6 w-6 mb-1", softwareType === 'other' ? "text-blue-500" : "text-gray-500")} />
                      <span className="text-xs">{language === 'th' ? 'อื่นๆ' : 'Other'}</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="licenseKey">{language === 'th' ? 'คีย์ลิขสิทธิ์' : 'License Key'}</Label>
                    <Input
                      id="licenseKey"
                      value={licenseKey}
                      onChange={(e) => setLicenseKey(e.target.value)}
                      placeholder={language === 'th' ? 'เช่น XXXX-XXXX-XXXX-XXXX' : 'e.g. XXXX-XXXX-XXXX-XXXX'}
                      className="mt-1 font-mono"
                    />
                  </div>
                  <div>
                    <Label htmlFor="licenseSeats">{language === 'th' ? 'จำนวนที่นั่ง' : 'License Seats'}</Label>
                    <Input
                      id="licenseSeats"
                      type="number"
                      value={licenseSeats}
                      onChange={(e) => setLicenseSeats(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder={language === 'th' ? 'เช่น 5' : 'e.g. 5'}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="softwareLocation">{language === 'th' ? 'สถานที่ติดตั้ง' : 'Installation Location'}</Label>
                    <Input
                      id="softwareLocation"
                      value={assetLocation}
                      onChange={(e) => setAssetLocation(e.target.value)}
                      placeholder={language === 'th' ? 'เช่น เครื่องในแผนกบัญชี' : 'e.g. Accounting Department Computers'}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="manufacturer">{language === 'th' ? 'ผู้ผลิต' : 'Manufacturer'}</Label>
                    <Input
                      id="manufacturer"
                      value={manufacturer}
                      onChange={(e) => setManufacturer(e.target.value)}
                      placeholder={language === 'th' ? 'เช่น Microsoft, Adobe' : 'e.g. Microsoft, Adobe'}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="purchaseDate">{language === 'th' ? 'วันที่ซื้อ' : 'Purchase Date'}</Label>
                    <Input
                      id="purchaseDate"
                      type="date"
                      value={purchaseDate}
                      onChange={(e) => setPurchaseDate(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="expirationDate" className="flex items-center">
                      {language === 'th' ? 'วันหมดอายุ' : 'Expiration Date'}
                      {expirationDate && (
                        <span className={cn("ml-2 text-xs px-2 py-0.5 rounded-full inline-flex items-center", 
                          getExpiryStatusColor(calculateDaysRemaining(expirationDate)))}>
                          <Clock className="h-3 w-3 mr-1" />
                          {calculateDaysRemaining(expirationDate) || 0} {language === 'th' ? 'วัน' : 'days'}
                        </span>
                      )}
                    </Label>
                    <Input
                      id="expirationDate"
                      type="date"
                      value={expirationDate}
                      onChange={(e) => setExpirationDate(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="status">{language === 'th' ? 'สถานะ' : 'Status'}</Label>
                  <Select 
                    value={status} 
                    onValueChange={(value) => setStatus(value as 'active' | 'expired' | 'maintenance' | 'decommissioned')}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder={language === 'th' ? 'เลือกสถานะ' : 'Select status'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">{language === 'th' ? 'ใช้งานอยู่' : 'Active'}</SelectItem>
                      <SelectItem value="expired">{language === 'th' ? 'หมดอายุ' : 'Expired'}</SelectItem>
                      <SelectItem value="maintenance">{language === 'th' ? 'อยู่ระหว่างเปลี่ยนแปลง' : 'Under Maintenance'}</SelectItem>
                      <SelectItem value="decommissioned">{language === 'th' ? 'เลิกใช้งาน' : 'Decommissioned'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="notes">{language === 'th' ? 'บันทึกเพิ่มเติม' : 'Notes'}</Label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 mt-1"
                    rows={3}
                    placeholder={language === 'th' ? 'บันทึกเพิ่มเติม...' : 'Additional notes...'}
                  />
                </div>
              </>
            )}

            {secondaryTab === 'ownership' && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800">
                  {language === 'th' ? 'ประวัติการถือครอง' : 'Ownership History'}
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="previousOwner">
                      {language === 'th' ? 'ผู้ใช้งานก่อนหน้า' : 'Previous Owner'}
                    </Label>
                    <Input
                      id="previousOwner"
                      value={previousOwner}
                      onChange={(e) => setPreviousOwner(e.target.value)}
                      placeholder={language === 'th' ? 'เช่น แผนกการตลาด' : 'e.g. Marketing Department'}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="previousDepartment">
                      {language === 'th' ? 'หน่วยงานก่อนหน้า' : 'Previous Department'}
                    </Label>
                    <Input
                      id="previousDepartment"
                      value={previousDepartment}
                      onChange={(e) => setPreviousDepartment(e.target.value)}
                      placeholder={language === 'th' ? 'เช่น ฝ่ายขาย' : 'e.g. Sales'}
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="acquisitionDate">
                    {language === 'th' ? 'วันที่ได้รับการส่งมอบ' : 'Acquisition Date'}
                  </Label>
                  <Input
                    id="acquisitionDate"
                    type="date"
                    value={acquisitionDate}
                    onChange={(e) => setAcquisitionDate(e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div className="bg-blue-50 p-3 rounded-md">
                  <div className="flex items-start">
                    <Users className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
                    <div>
                      <h4 className="font-medium text-blue-800">
                        {language === 'th' ? 'ข้อมูลการเปลี่ยนผู้ใช้งาน' : 'User Transfer Information'}
                      </h4>
                      <p className="text-sm text-blue-600">
                        {language === 'th' 
                          ? 'บันทึกข้อมูลผู้ใช้งานหรือหน่วยงานที่เคยเป็นเจ้าของลิขสิทธิ์ซอฟต์แวร์นี้ก่อนหน้า'
                          : 'Record information about previous users or departments that owned this software license'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {secondaryTab === 'responsibility' && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800">
                  {language === 'th' ? 'ผู้รับผิดชอบ' : 'Responsible Parties'}
                </h3>
                
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="responsibleDepartment">
                      <Building className="h-4 w-4 inline mr-1" />
                      {language === 'th' ? 'หน่วยงานที่รับผิดชอบ' : 'Responsible Department'}
                    </Label>
                    <Input
                      id="responsibleDepartment"
                      value={responsibleDepartment}
                      onChange={(e) => setResponsibleDepartment(e.target.value)}
                      placeholder={language === 'th' ? 'เช่น ฝ่ายเทคโนโลยีสารสนเทศ' : 'e.g. IT Department'}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="responsibleEmployee">
                      <User className="h-4 w-4 inline mr-1" />
                      {language === 'th' ? 'พนักงานผู้รับผิดชอบ' : 'Responsible Employee'}
                    </Label>
                    <Input
                      id="responsibleEmployee"
                      value={responsibleEmployee}
                      onChange={(e) => setResponsibleEmployee(e.target.value)}
                      placeholder={language === 'th' ? 'เช่น นายสมชาย ใจดี' : 'e.g. John Doe'}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="responsibleIT">
                      <Laptop className="h-4 w-4 inline mr-1" />
                      {language === 'th' ? 'เจ้าหน้าที่ IT ผู้ดูแล' : 'IT Support Contact'}
                    </Label>
                    <Input
                      id="responsibleIT"
                      value={responsibleIT}
                      onChange={(e) => setResponsibleIT(e.target.value)}
                      placeholder={language === 'th' ? 'เช่น นายวิชัย ช่างซ่อม' : 'e.g. Jane Smith'}
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div className="bg-purple-50 p-3 rounded-md">
                  <div className="flex items-start">
                    <Contact className="h-5 w-5 text-purple-500 mt-0.5 mr-2" />
                    <div>
                      <h4 className="font-medium text-purple-800">
                        {language === 'th' ? 'ข้อมูลผู้รับผิดชอบ' : 'Responsibility Information'}
                      </h4>
                      <p className="text-sm text-purple-600">
                        {language === 'th' 
                          ? 'ระบุผู้รับผิดชอบลิขสิทธิ์ซอฟต์แวร์นี้ เพื่อการบริหารจัดการและต่ออายุลิขสิทธิ์'
                          : 'Specify who is responsible for this software license for management and renewal purposes'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {secondaryTab === 'repairs' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-800">
                    {language === 'th' ? 'ประวัติการอัปเดตและปรับปรุง' : 'Update and Maintenance History'}
                  </h3>
                  
                  <Button 
                    type="button" 
                    onClick={() => setIsAddingRepair(true)}
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1"
                  >
                    <span className="text-xs">+</span>
                    {language === 'th' ? 'เพิ่มประวัติการอัปเดต' : 'Add Update Record'}
                  </Button>
                </div>
                
                {isAddingRepair && (
                  <div className="border p-3 rounded-md bg-gray-50">
                    <h4 className="font-medium mb-3">
                      {language === 'th' ? 'เพิ่มประวัติการอัปเดต/ปรับปรุงใหม่' : 'Add New Update/Maintenance Record'}
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <Label htmlFor="updateDate">
                          {language === 'th' ? 'วันที่อัปเดต' : 'Update Date'}
                        </Label>
                        <Input
                          id="updateDate"
                          type="date"
                          value={newRepairDate}
                          onChange={(e) => setNewRepairDate(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="updateCost">
                          {language === 'th' ? 'ค่าใช้จ่าย' : 'Cost'}
                        </Label>
                        <Input
                          id="updateCost"
                          type="number"
                          value={newRepairCost}
                          onChange={(e) => setNewRepairCost(e.target.value === '' ? '' : Number(e.target.value))}
                          placeholder={language === 'th' ? 'เช่น 1000' : 'e.g. 1000'}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <Label htmlFor="updateDescription">
                        {language === 'th' ? 'รายละเอียดการอัปเดต/ปรับปรุง' : 'Update/Maintenance Details'}
                      </Label>
                      <textarea
                        id="updateDescription"
                        value={newRepairDescription}
                        onChange={(e) => setNewRepairDescription(e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2 mt-1"
                        rows={2}
                        placeholder={language === 'th' ? 'อธิบายการอัปเดตหรือปรับปรุง...' : 'Describe the update or maintenance...'}
                      />
                    </div>
                    
                    <div className="mb-3">
                      <Label htmlFor="updatePerson">
                        {language === 'th' ? 'ผู้ดำเนินการ' : 'Performed by'}
                      </Label>
                      <Input
                        id="updatePerson"
                        value={newRepairTechnician}
                        onChange={(e) => setNewRepairTechnician(e.target.value)}
                        placeholder={language === 'th' ? 'เช่น แผนก IT' : 'e.g. IT Department'}
                        className="mt-1"
                      />
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button 
                        type="button" 
                        onClick={() => setIsAddingRepair(false)}
                        variant="outline"
                        size="sm"
                      >
                        {language === 'th' ? 'ยกเลิก' : 'Cancel'}
                      </Button>
                      <Button 
                        type="button" 
                        onClick={handleAddRepair}
                        size="sm"
                      >
                        {language === 'th' ? 'เพิ่ม' : 'Add'}
                      </Button>
                    </div>
                  </div>
                )}
                
                {repairHistory.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-md border border-dashed">
                    <History className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">
                      {language === 'th' ? 'ยังไม่มีประวัติการอัปเดตหรือปรับปรุง' : 'No update or maintenance history yet'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {repairHistory.map((repair) => (
                      <div key={repair.id} className="border rounded-md p-3 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <span className="bg-blue-100 text-blue-800 text-xs py-1 px-2 rounded">
                              {new Date(repair.date).toLocaleDateString(language === 'th' ? 'th-TH' : 'en-US')}
                            </span>
                            {repair.cost && (
                              <span className="bg-green-100 text-green-800 text-xs py-1 px-2 rounded">
                                {new Intl.NumberFormat(language === 'th' ? 'th-TH' : 'en-US', { 
                                  style: 'currency', 
                                  currency: 'THB',
                                  minimumFractionDigits: 0
                                }).format(repair.cost)}
                              </span>
                            )}
                          </div>
                          <button 
                            type="button" 
                            onClick={() => handleRemoveRepair(repair.id)}
                            className="text-red-500 hover:text-red-700 text-xs"
                          >
                            {language === 'th' ? 'ลบ' : 'Remove'}
                          </button>
                        </div>
                        <p className="text-sm mt-2">{repair.description}</p>
                        {repair.technician && (
                          <p className="text-xs text-gray-500 mt-1">
                            {language === 'th' ? 'ดำเนินการโดย: ' : 'Performed by: '}
                            {repair.technician}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            {language === 'th' ? 'ยกเลิก' : 'Cancel'}
          </Button>
          <Button onClick={handleSubmit}>
            {language === 'th' ? 'บันทึก' : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddAssetModal ;
