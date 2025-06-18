
import React, { useState, useEffect } from 'react';
import { User } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
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
import { UserCog } from 'lucide-react';

interface UserRoleModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (userId: number | string, role: string) => Promise<void>;
}

const UserRoleModal = ({ user, isOpen, onClose, onSave }: UserRoleModalProps) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState<string>('user');
  const [isSaving, setIsSaving] = useState(false);

  // Reset role when a new user is selected
  useEffect(() => {
    if (user) {
      setSelectedRole(user.role || 'user');
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      await onSave(user.id, selectedRole);
      toast({
        title: language === 'th' ? 'อัปเดตบทบาทสำเร็จ' : 'Role updated successfully',
        description: language === 'th' 
          ? `บทบาทของ ${user.name} ถูกเปลี่ยนเป็น ${selectedRole}` 
          : `${user.name}'s role has been changed to ${selectedRole}`,
      });
    } catch (error) {
      toast({
        title: language === 'th' ? 'เกิดข้อผิดพลาด' : 'Error',
        description: language === 'th' 
          ? 'ไม่สามารถอัปเดตบทบาทได้' 
          : 'Could not update role',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
      if (onClose) onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isSaving && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5 text-blue-600" />
            {language === 'th' ? 'จัดการบทบาทผู้ใช้' : 'Manage User Role'}
          </DialogTitle>
        </DialogHeader>
        
        {user && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-sm font-medium text-right">
                {language === 'th' ? 'ชื่อผู้ใช้' : 'User'}:
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
                {language === 'th' ? 'บทบาทปัจจุบัน' : 'Current Role'}:
              </span>
              <span className="col-span-3 capitalize">{user.role}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="role" className="text-sm font-medium text-right">
                {language === 'th' ? 'บทบาทใหม่' : 'New Role'}:
              </label>
              <div className="col-span-3">
                <Select
                  value={selectedRole}
                  onValueChange={setSelectedRole}
                  disabled={isSaving}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder={language === 'th' ? 'เลือกบทบาท' : 'Select role'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="technician">Technician</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
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
            disabled={isSaving || !user}
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

export default UserRoleModal;
