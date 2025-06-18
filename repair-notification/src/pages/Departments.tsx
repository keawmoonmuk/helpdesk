
import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Building, Plus, Edit, Trash2, Search, Users, MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Swal from 'sweetalert2';

// Define schema for department form
const departmentSchema = z.object({
  departmentName: z.string().min(2, {
    message: "Department name must be at least 2 characters.",
  }),
  departmentCode: z.string().min(1, {
    message: "Department code is required.",
  }),
  building: z.string().min(1, {
    message: "Building is required.",
  }),
  floor: z.string().min(1, {
    message: "Floor is required.",
  }),
  manager: z.string().optional(),
  description: z.string().optional(),
});

type DepartmentFormValues = z.infer<typeof departmentSchema>;

// Mock department data
const mockDepartments = [
  {
    id: 1,
    name: 'Marketing',
    code: 'MKT',
    building: 'Building A',
    floor: '3',
    manager: 'John Smith',
    staff: 12,
    createdAt: '2023-01-15',
  },
  {
    id: 2,
    name: 'Finance',
    code: 'FIN',
    building: 'Building A',
    floor: '4',
    manager: 'Jane Doe',
    staff: 8,
    createdAt: '2023-01-15',
  },
  {
    id: 3,
    name: 'IT Support',
    code: 'IT',
    building: 'Building B',
    floor: '2',
    manager: 'Mike Johnson',
    staff: 15,
    createdAt: '2023-01-20',
  },
  {
    id: 4,
    name: 'Human Resources',
    code: 'HR',
    building: 'Building A',
    floor: '5',
    manager: 'Sarah Williams',
    staff: 6,
    createdAt: '2023-02-01',
  },
  {
    id: 5,
    name: 'Operations',
    code: 'OPS',
    building: 'Building C',
    floor: '1',
    manager: 'Robert Brown',
    staff: 20,
    createdAt: '2023-02-10',
  }
];

const Departments = () => {
  const { language } = useLanguage();
  const [departments, setDepartments] = useState(mockDepartments);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<DepartmentFormValues | null>(null);
  
  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      departmentName: '',
      departmentCode: '',
      building: '',
      floor: '',
      manager: '',
      description: ''
    }
  });

  // Filter departments based on search term
  const filteredDepartments = departments.filter(dept => 
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.building.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddDepartment = () => {
    form.reset();
    setEditingDepartment(null);
    setShowModal(true);
  };

  const handleEditDepartment = (department: any) => {
    form.reset({
      departmentName: department.name,
      departmentCode: department.code,
      building: department.building,
      floor: department.floor,
      manager: department.manager,
      description: ''
    });
    setEditingDepartment({
      departmentName: department.name,
      departmentCode: department.code,
      building: department.building,
      floor: department.floor,
      manager: department.manager,
      description: ''
    });
    setShowModal(true);
  };

  const handleDeleteDepartment = async (id: number) => {
    const result = await Swal.fire({
      title: language === 'th' ? 'คุณแน่ใจหรือไม่?' : 'Are you sure?',
      text: language === 'th' 
        ? 'คุณต้องการลบแผนกนี้หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้!' 
        : 'Do you want to delete this department? This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: language === 'th' ? 'ใช่, ลบเลย!' : 'Yes, delete it!',
      cancelButtonText: language === 'th' ? 'ยกเลิก' : 'Cancel'
    });
    
    if (result.isConfirmed) {
      // Filter out the deleted department
      setDepartments(departments.filter(dept => dept.id !== id));
      
      toast.success(
        language === 'th' 
          ? 'ลบแผนกเรียบร้อยแล้ว' 
          : 'Department deleted successfully'
      );
    }
  };

  const onSubmit = async (data: DepartmentFormValues) => {
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (editingDepartment) {
        // Update existing department
        setDepartments(departments.map(dept => 
          dept.name === editingDepartment.departmentName 
            ? {
                ...dept,
                name: data.departmentName,
                code: data.departmentCode,
                building: data.building,
                floor: data.floor,
                manager: data.manager || dept.manager
              }
            : dept
        ));
        
        toast.success(
          language === 'th' 
            ? 'อัปเดตแผนกเรียบร้อยแล้ว' 
            : 'Department updated successfully'
        );
      } else {
        // Add new department
        const newDepartment = {
          id: departments.length + 1,
          name: data.departmentName,
          code: data.departmentCode,
          building: data.building,
          floor: data.floor,
          manager: data.manager || 'Not assigned',
          staff: 0,
          createdAt: new Date().toISOString().split('T')[0]
        };
        
        setDepartments([...departments, newDepartment]);
        
        toast.success(
          language === 'th' 
            ? 'เพิ่มแผนกเรียบร้อยแล้ว' 
            : 'Department added successfully'
        );
      }
      
      setShowModal(false);
    } catch (error) {
      console.error('Error saving department:', error);
      toast.error(
        language === 'th' 
          ? 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' 
          : 'Error saving department'
      );
    }
  };

  return (
    <DashboardLayout title={language === 'th' ? 'จัดการแผนก' : 'Department Management'}>
      <div className="space-y-6">
        <Card>
          <CardHeader className="bg-blue-50">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-semibold text-blue-800 flex items-center">
                <Building className="w-5 h-5 mr-2" />
                {language === 'th' ? 'ข้อมูลแผนก' : 'Departments'}
              </CardTitle>
              <div className="flex space-x-2">
                <div className="relative w-64">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder={language === 'th' ? 'ค้นหาแผนก...' : 'Search departments...'}
                    className="pl-8" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={handleAddDepartment} 
                  className="bg-blue-600 hover:bg-blue-700 flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  {language === 'th' ? 'เพิ่มแผนก' : 'Add Department'}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">
                    {language === 'th' ? 'รหัส' : 'Code'}
                  </TableHead>
                  <TableHead>
                    {language === 'th' ? 'ชื่อแผนก' : 'Department Name'}
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {language === 'th' ? 'สถานที่' : 'Location'}
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {language === 'th' ? 'จำนวนพนักงาน' : 'Staff Count'}
                    </div>
                  </TableHead>
                  <TableHead>
                    {language === 'th' ? 'หัวหน้าแผนก' : 'Manager'}
                  </TableHead>
                  <TableHead>
                    {language === 'th' ? 'วันที่สร้าง' : 'Created Date'}
                  </TableHead>
                  <TableHead className="text-right">
                    {language === 'th' ? 'จัดการ' : 'Actions'}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDepartments.map((department) => (
                  <TableRow key={department.id}>
                    <TableCell className="font-medium">{department.code}</TableCell>
                    <TableCell>{department.name}</TableCell>
                    <TableCell>{`${department.building}, ${language === 'th' ? 'ชั้น' : 'Floor'} ${department.floor}`}</TableCell>
                    <TableCell>{department.staff}</TableCell>
                    <TableCell>{department.manager}</TableCell>
                    <TableCell>{department.createdAt}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditDepartment(department)}
                          title={language === 'th' ? 'แก้ไข' : 'Edit'}
                        >
                          <Edit className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteDepartment(department.id)}
                          title={language === 'th' ? 'ลบ' : 'Delete'}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                
                {filteredDepartments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      {searchTerm
                        ? (language === 'th' ? 'ไม่พบผลลัพธ์สำหรับ' : 'No results found for') + ` "${searchTerm}"`
                        : (language === 'th' ? 'ยังไม่มีข้อมูลแผนก' : 'No departments available')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Department Form Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingDepartment 
                ? (language === 'th' ? 'แก้ไขแผนก' : 'Edit Department') 
                : (language === 'th' ? 'เพิ่มแผนกใหม่' : 'Add New Department')}
            </DialogTitle>
            <DialogDescription>
              {language === 'th' 
                ? 'กรอกข้อมูลแผนกด้านล่าง เมื่อเสร็จแล้วคลิกบันทึก' 
                : 'Fill in the department details below. Click save when you\'re done.'}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="departmentName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{language === 'th' ? 'ชื่อแผนก' : 'Department Name'}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={language === 'th' ? 'เช่น ฝ่ายการตลาด' : "e.g. Marketing"} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="departmentCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{language === 'th' ? 'รหัสแผนก' : 'Department Code'}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={language === 'th' ? 'เช่น MKT' : "e.g. MKT"} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="building"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{language === 'th' ? 'อาคาร' : 'Building'}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={language === 'th' ? 'เช่น อาคาร A' : "e.g. Building A"} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="floor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{language === 'th' ? 'ชั้น' : 'Floor'}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={language === 'th' ? 'เช่น 3' : "e.g. 3"} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="manager"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{language === 'th' ? 'หัวหน้าแผนก' : 'Department Manager'}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={language === 'th' ? 'เช่น นายสมชาย ใจดี' : "e.g. John Smith"} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{language === 'th' ? 'รายละเอียด' : 'Description'}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={language === 'th' ? 'รายละเอียดเพิ่มเติม' : "Additional details"} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowModal(false)}
                >
                  {language === 'th' ? 'ยกเลิก' : 'Cancel'}
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {language === 'th' ? 'บันทึก' : 'Save'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Departments;
