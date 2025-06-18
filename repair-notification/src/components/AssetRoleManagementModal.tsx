
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { UserCog, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { AssetManagementRole, User } from '@/types';

interface AssetRoleManagementModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: AssetManagementRole) => Promise<void>;
}

const AssetRoleManagementModal = ({ user, isOpen, onClose, onSave }: AssetRoleManagementModalProps) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState<'asset-manager' | 'asset-staff' | 'it-manager'>('asset-staff');
  const [selectedDept, setSelectedDept] = useState<string>('');
  const [assignedDate, setAssignedDate] = useState<Date>(new Date());
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [startDatePickerOpen, setStartDatePickerOpen] = useState(false);
  const [endDatePickerOpen, setEndDatePickerOpen] = useState(false);

  // Available departments
  const departments = ['IT', 'Finance', 'HR', 'Marketing', 'Operations', 'Maintenance'];

  // Permission options based on role
  const permissionOptions = {
    'asset-manager': [
      { id: 'create', label: { th: 'สร้างทรัพย์สิน', en: 'Create Assets' } },
      { id: 'update', label: { th: 'อัปเดตทรัพย์สิน', en: 'Update Assets' } },
      { id: 'delete', label: { th: 'ลบทรัพย์สิน', en: 'Delete Assets' } },
      { id: 'assign', label: { th: 'มอบหมายทรัพย์สิน', en: 'Assign Assets' } },
      { id: 'report', label: { th: 'สร้างรายงาน', en: 'Generate Reports' } },
    ],
    'asset-staff': [
      { id: 'view', label: { th: 'ดูทรัพย์สิน', en: 'View Assets' } },
      { id: 'update', label: { th: 'อัปเดตทรัพย์สิน', en: 'Update Assets' } },
      { id: 'assign', label: { th: 'มอบหมายทรัพย์สิน', en: 'Assign Assets' } },
    ],
    'it-manager': [
      { id: 'create', label: { th: 'สร้างทรัพย์สิน', en: 'Create Assets' } },
      { id: 'update', label: { th: 'อัปเดตทรัพย์สิน', en: 'Update Assets' } },
      { id: 'maintain', label: { th: 'ดูแลทรัพย์สิน', en: 'Maintain Assets' } },
      { id: 'report', label: { th: 'สร้างรายงาน', en: 'Generate Reports' } },
    ]
  };

  // Reset form when modal opens with a user
  useEffect(() => {
    if (user && isOpen) {
      setSelectedDept(user.department || '');
      setPermissions([]);
      setAssignedDate(new Date());
      setExpiryDate(undefined);
      setSelectedRole('asset-staff');
    }
  }, [user, isOpen]);

  const handlePermissionChange = (checked: boolean, permission: string) => {
    setPermissions(
      checked 
        ? [...permissions, permission] 
        : permissions.filter(p => p !== permission)
    );
  };

  const handleSave = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      const roleData: AssetManagementRole = {
        id: Math.random().toString(36).substring(2, 9),
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        roleName: selectedRole,
        department: selectedDept,
        assignedDate: format(assignedDate, 'yyyy-MM-dd'),
        expiryDate: expiryDate ? format(expiryDate, 'yyyy-MM-dd') : undefined,
        permissions: permissions,
        active: true
      };
      
      await onSave(roleData);
      toast({
        title: language === 'th' ? 'บันทึกบทบาทสำเร็จ' : 'Role assigned successfully',
        description: language === 'th' 
          ? `บทบาทผู้จัดการทรัพย์สินได้รับการมอบหมายให้ ${user.name}` 
          : `Asset management role has been assigned to ${user.name}`,
      });
    } catch (error) {
      toast({
        title: language === 'th' ? 'เกิดข้อผิดพลาด' : 'Error',
        description: language === 'th' 
          ? 'ไม่สามารถบันทึกบทบาทได้' 
          : 'Could not save role assignment',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
      if (onClose) onClose();
    }
  };

  const handleStartDateSelect = (date: Date | undefined) => {
    if (date) {
      setAssignedDate(date);
    }
    setStartDatePickerOpen(false);
  };
  
  const handleEndDateSelect = (date: Date | undefined) => {
    setExpiryDate(date);
    setEndDatePickerOpen(false);
  };

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => !open && !isSaving && onClose()}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5 text-blue-600" />
            {language === 'th' ? 'กำหนดบทบาทการจัดการทรัพย์สิน' : 'Assign Asset Management Role'}
          </DialogTitle>
          <DialogDescription>
            {language === 'th' 
              ? 'กำหนดบทบาทและสิทธิ์ในการจัดการทรัพย์สินให้กับผู้ใช้นี้' 
              : 'Assign asset management roles and permissions to this user'}
          </DialogDescription>
        </DialogHeader>
        
        {user && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-sm font-medium text-right">
                {language === 'th' ? 'ผู้ใช้' : 'User'}:
              </span>
              <span className="col-span-3 font-medium">{user.name}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-sm font-medium text-right">
                {language === 'th' ? 'อีเมล' : 'Email'}:
              </span>
              <span className="col-span-3">{user.email}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-sm font-medium text-right">
                {language === 'th' ? 'บทบาทระบบ' : 'System Role'}:
              </span>
              <span className="col-span-3 capitalize">{user.role}</span>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="asset-role" className="text-sm font-medium text-right">
                {language === 'th' ? 'บทบาททรัพย์สิน' : 'Asset Role'}:
              </label>
              <div className="col-span-3">
                <Select
                  value={selectedRole}
                  onValueChange={(value: 'asset-manager' | 'asset-staff' | 'it-manager') => setSelectedRole(value)}
                  disabled={isSaving}
                >
                  <SelectTrigger id="asset-role">
                    <SelectValue placeholder={language === 'th' ? 'เลือกบทบาท' : 'Select role'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asset-manager">
                      {language === 'th' ? 'ผู้จัดการทรัพย์สิน' : 'Asset Manager'}
                    </SelectItem>
                    <SelectItem value="asset-staff">
                      {language === 'th' ? 'เจ้าหน้าที่ทรัพย์สิน' : 'Asset Staff'}
                    </SelectItem>
                    <SelectItem value="it-manager">
                      {language === 'th' ? 'ผู้ดูแลทรัพย์สิน IT' : 'IT Asset Manager'}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="department" className="text-sm font-medium text-right">
                {language === 'th' ? 'แผนก' : 'Department'}:
              </label>
              <div className="col-span-3">
                <Select 
                  value={selectedDept} 
                  onValueChange={setSelectedDept}
                  disabled={isSaving}
                >
                  <SelectTrigger id="department">
                    <SelectValue placeholder={language === 'th' ? 'เลือกแผนก' : 'Select department'} />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="assign-date" className="text-sm font-medium text-right">
                {language === 'th' ? 'วันที่เริ่มต้น' : 'Start Date'}:
              </label>
              <div className="col-span-3">
                <Popover 
                  open={startDatePickerOpen} 
                  onOpenChange={setStartDatePickerOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      id="assign-date"
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      disabled={isSaving}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {assignedDate ? format(assignedDate, 'PPP') : (
                        language === 'th' ? 'เลือกวันที่' : 'Pick a date'
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={assignedDate}
                      onSelect={handleStartDateSelect}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="expiry-date" className="text-sm font-medium text-right">
                {language === 'th' ? 'วันหมดอายุ' : 'Expiry Date'}:
              </label>
              <div className="col-span-3">
                <Popover
                  open={endDatePickerOpen}
                  onOpenChange={setEndDatePickerOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      id="expiry-date"
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      disabled={isSaving}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {expiryDate ? format(expiryDate, 'PPP') : (
                        language === 'th' ? 'เลือกวันที่ (ไม่บังคับ)' : 'Optional'
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={expiryDate}
                      onSelect={handleEndDateSelect}
                      initialFocus
                      fromDate={new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              <span className="text-sm font-medium text-right pt-2">
                {language === 'th' ? 'สิทธิ์' : 'Permissions'}:
              </span>
              <div className="col-span-3 space-y-2">
                {permissionOptions[selectedRole].map((permission) => (
                  <div key={permission.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`permission-${permission.id}`}
                      checked={permissions.includes(permission.id)}
                      onCheckedChange={(checked) => 
                        handlePermissionChange(checked as boolean, permission.id)
                      }
                      disabled={isSaving}
                    />
                    <label 
                      htmlFor={`permission-${permission.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {language === 'th' ? permission.label.th : permission.label.en}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button 
              variant="outline" 
              onClick={onClose}
              disabled={isSaving}
              type="button"
            >
              {language === 'th' ? 'ยกเลิก' : 'Cancel'}
            </Button>
          </DialogClose>
          <Button 
            onClick={handleSave} 
            disabled={isSaving || !user || !selectedDept || permissions.length === 0}
            type="button"
          >
            {isSaving ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                {language === 'th' ? 'กำลังบันทึก...' : 'Saving...'}
              </>
            ) : (
              language === 'th' ? 'บันทึก' : 'Save'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssetRoleManagementModal;
