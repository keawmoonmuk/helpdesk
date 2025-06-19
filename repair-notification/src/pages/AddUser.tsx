
import DashboardLayout from "@/components/DashboardLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AddUser = () => {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    role: '',
    department: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.fullName || !formData.email || !formData.role || !formData.department) {
      toast.error(language === 'th' ? 'กรุณากรอกข้อมูลที่จำเป็น' : 'Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error(language === 'th' ? 'รหัสผ่านไม่ตรงกัน' : 'Passwords do not match');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare the request data based on API requirements
      const userData = {
        userName: formData.username,
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        departmentId: parseInt(formData.department),
        role: formData.role.toUpperCase()
      };
      
      console.log('Submitting user data:', userData);
      
      const response = await fetch('https://helpdesk-production-51fe.up.railway.app/api/admin/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add user');
      }
      
      const data = await response.json();
      console.log('API response:', data);
      
      toast.success(
        language === 'th' 
          ? `เพิ่มผู้ใช้ "${formData.fullName}" เรียบร้อยแล้ว` 
          : `User "${formData.fullName}" added successfully`
      );
      
      // Reset form
      setFormData({
        username: '',
        fullName: '',
        email: '',
        role: '',
        department: '',
        phone: '',
        password: '',
        confirmPassword: ''
      });

    } catch (error) {
      console.error('Failed to add user:', error);
      toast.error(
        language === 'th'
          ? `ไม่สามารถเพิ่มผู้ใช้งานได้: ${(error as Error).message}`
          : `Failed to add user: ${(error as Error).message}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout title={language === 'th' ? 'เพิ่มผู้ใช้งาน' : 'Add User'}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" className="mr-2" asChild>
            <a href="/users">
              <ArrowLeft className="h-4 w-4 mr-1" />
              {language === 'th' ? 'กลับไปยังรายการผู้ใช้งาน' : 'Back to Users'}
            </a>
          </Button>
          <h1 className="text-2xl font-bold flex items-center">
            <UserPlus className="mr-2 h-6 w-6 text-blue-600" />
            {language === 'th' ? 'เพิ่มผู้ใช้งานใหม่' : 'Add New User'}
          </h1>
        </div>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>
            {language === 'th' ? 'ข้อมูลผู้ใช้งาน' : 'User Information'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">
                {language === 'th' ? 'ชื่อ-นามสกุล' : 'Username'} <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="username" 
                value={formData.username}
                onChange={handleChange}
                placeholder={language === 'th' ? 'ชื่อผู้ใช้งาน' : 'Username'}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">
                {language === 'th' ? 'ชื่อ-นามสกุล' : 'Full Name'} <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="fullName" 
                value={formData.fullName}
                onChange={handleChange}
                placeholder={language === 'th' ? 'ชื่อ นามสกุล' : 'Full Name'}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                {language === 'th' ? 'อีเมล' : 'Email'} <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="email" 
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@example.com"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">
                  {language === 'th' ? 'บทบาท' : 'Role'} <span className="text-red-500">*</span>
                </Label>
                <Select onValueChange={(value) => handleSelectChange('role', value)}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder={language === 'th' ? 'เลือกบทบาท' : 'Select role'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">
                      {language === 'th' ? 'ผู้ดูแลระบบ' : 'Admin'}
                    </SelectItem>
                    <SelectItem value="technician">
                      {language === 'th' ? 'ช่างเทคนิค' : 'Technician'}
                    </SelectItem>
                    <SelectItem value="user">
                      {language === 'th' ? 'ผู้ใช้งานทั่วไป' : 'Regular User'}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">
                  {language === 'th' ? 'แผนก' : 'Department'} <span className="text-red-500">*</span>
                </Label>
                <Select onValueChange={(value) => handleSelectChange('department', value)}>
                  <SelectTrigger id="department">
                    <SelectValue placeholder={language === 'th' ? 'เลือกแผนก' : 'Select department'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">IT</SelectItem>
                    <SelectItem value="2">
                      {language === 'th' ? 'การตลาด' : 'Marketing'}
                    </SelectItem>
                    <SelectItem value="3">
                      {language === 'th' ? 'การเงิน' : 'Finance'}
                    </SelectItem>
                    <SelectItem value="4">
                      {language === 'th' ? 'ทรัพยากรบุคคล' : 'Human Resources'}
                    </SelectItem>
                    <SelectItem value="5">
                      {language === 'th' ? 'ปฏิบัติการ' : 'Operations'}
                    </SelectItem>
                    <SelectItem value="11">CVD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">
                {language === 'th' ? 'เบอร์โทรศัพท์' : 'Phone Number'}
              </Label>
              <Input 
                id="phone" 
                value={formData.phone}
                onChange={handleChange}
                placeholder={language === 'th' ? 'เบอร์โทรศัพท์' : 'Phone Number'}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">
                  {language === 'th' ? 'รหัสผ่าน' : 'Password'} <span className="text-red-500">*</span>
                </Label>
                <Input 
                  id="password" 
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={language === 'th' ? 'รหัสผ่าน' : 'Password'}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  {language === 'th' ? 'ยืนยันรหัสผ่าน' : 'Confirm Password'} <span className="text-red-500">*</span>
                </Label>
                <Input 
                  id="confirmPassword" 
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder={language === 'th' ? 'ยืนยันรหัสผ่าน' : 'Confirm Password'}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button variant="outline" type="button" className="mr-2" asChild>
                <a href="/users">
                  {language === 'th' ? 'ยกเลิก' : 'Cancel'}
                </a>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {language === 'th' ? 'กำลังเพิ่มผู้ใช้...' : 'Adding user...'}
                  </div>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-1" />
                    {language === 'th' ? 'เพิ่มผู้ใช้งาน' : 'Add User'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default AddUser;
