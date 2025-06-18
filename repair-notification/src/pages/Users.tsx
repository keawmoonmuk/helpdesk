
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Users as UsersIcon, 
  Plus, 
  Search, 
  UserPlus, 
  Filter, 
  MoreHorizontal,
  Shield,
  UserCog,
  PenLine,
  Trash2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { User, AssetManagementRole } from "@/types";
import UserRoleModal from "@/components/UserRoleModal";
import AssetRoleManagementModal from "@/components/AssetRoleManagementModal";
import { toast } from "sonner";
import { useRoleBasedApi } from "@/hooks/useRoleBasedApi";
import { Link } from "react-router-dom";

const Users = () => {
  const { language } = useLanguage();
  const { user: currentUser } = useAuth();
  const api = useRoleBasedApi();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showAssetRoleModal, setShowAssetRoleModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [filterRole, setFilterRole] = useState("all");

  // Fixed the type of 'role' to use the specific union types from User interface
  const users: User[] = [
    { 
      id: 1, 
      name: 'John Doe', 
      email: 'john.doe@example.com', 
      role: 'admin', 
      department: 'IT', 
      status: 'Active',
      joiningDate: '15/01/2023',
      username: 'johndoe'
    },
    { 
      id: 2, 
      name: 'Sarah Johnson', 
      email: 'sarah.j@example.com', 
      role: 'technician', 
      department: 'Maintenance', 
      status: 'Active',
      joiningDate: '03/02/2023',
      username: 'sarahj'
    },
    { 
      id: 3, 
      name: 'Michael Brown', 
      email: 'michael.b@example.com', 
      role: 'user', 
      department: 'Marketing', 
      status: 'Active',
      joiningDate: '21/02/2023',
      username: 'michaelb'
    },
    { 
      id: 4, 
      name: 'Emily Davis', 
      email: 'emily.d@example.com', 
      role: 'user', 
      department: 'Finance', 
      status: 'Inactive',
      joiningDate: '12/03/2023',
      username: 'emilyd'
    },
    { 
      id: 5, 
      name: 'Robert Wilson', 
      email: 'robert.w@example.com', 
      role: 'technician', 
      department: 'IT', 
      status: 'Active',
      joiningDate: '05/04/2023',
      username: 'robertw'
    },
  ];

  const handleManageRoles = (user: User) => {
    setSelectedUser(user);
    setShowRoleModal(true);
  };

  const handleManageAssetRoles = (user: User) => {
    setSelectedUser(user);
    setShowAssetRoleModal(true);
  };

  const handleCloseRoleModal = () => {
    setShowRoleModal(false);
  };

  const handleCloseAssetRoleModal = () => {
    setShowAssetRoleModal(false);
  };

  const handleSaveRole = async (userId: number | string, newRole: string) => {
    // In a real app, this would make an API call
    console.log(`User ${userId} role updated to ${newRole}`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success(
      language === 'th' 
        ? 'อัปเดตบทบาทสำเร็จ' 
        : 'Role updated successfully'
    );
    
    return Promise.resolve();
  };

  const handleSaveAssetRole = async (roleData: AssetManagementRole) => {
    // In a real app, this would make an API call
    console.log('Asset role saved:', roleData);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success(
      language === 'th' 
        ? 'บันทึกบทบาทการจัดการทรัพย์สินสำเร็จ' 
        : 'Asset management role saved successfully'
    );
    
    return Promise.resolve();
  };

  const handleEditUser = (user: User) => {
    toast.info(
      language === 'th'
        ? `กำลังแก้ไขผู้ใช้ ${user.name}`
        : `Editing user ${user.name}`
    );
  };

  const handleDeleteUser = (user: User) => {
    toast.success(
      language === 'th'
        ? `ลบผู้ใช้ ${user.name} สำเร็จ`
        : `User ${user.name} deleted successfully`
    );
  };

  // Filter users based on search term and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = filterDepartment === 'all' || user.department === filterDepartment;
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    
    return matchesSearch && matchesDepartment && matchesRole;
  });

  // Get unique departments for the filter
  const departments = ['all', ...new Set(users.map(user => user.department || ''))].filter(Boolean);

  return (
    <DashboardLayout title={language === 'th' ? 'จัดการผู้ใช้งาน' : 'User Management'}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <UsersIcon className="mr-2 h-6 w-6 text-blue-600" />
          {language === 'th' ? 'จัดการผู้ใช้งานระบบ' : 'System Users Management'}
        </h1>
        <Link to="/add-user">
          <Button 
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all hover:shadow-lg"
          >
            <UserPlus className="h-4 w-4" />
            <span>{language === 'th' ? 'เพิ่มผู้ใช้ใหม่' : 'Add New User'}</span>
          </Button>
        </Link>
      </div>

      <Card className="mb-6 shadow-md border-0">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder={language === 'th' ? 'ค้นหาผู้ใช้...' : 'Search users...'}
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select 
                value={filterDepartment} 
                onValueChange={setFilterDepartment}
              >
                <SelectTrigger>
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder={language === 'th' ? 'กรองตามแผนก' : 'Filter by department'} />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {language === 'th' ? 'ทั้งหมด' : 'All Departments'}
                  </SelectItem>
                  {departments.filter(d => d !== 'all').map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-48">
              <Select 
                value={filterRole} 
                onValueChange={setFilterRole}
              >
                <SelectTrigger>
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder={language === 'th' ? 'กรองตามบทบาท' : 'Filter by role'} />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {language === 'th' ? 'ทั้งหมด' : 'All Roles'}
                  </SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="technician">Technician</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-white rounded-lg shadow-md overflow-hidden border-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {language === 'th' ? 'ชื่อ' : 'Name'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {language === 'th' ? 'อีเมล' : 'Email'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {language === 'th' ? 'บทบาท' : 'Role'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {language === 'th' ? 'แผนก' : 'Department'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {language === 'th' ? 'สถานะ' : 'Status'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {language === 'th' ? 'เข้าร่วมเมื่อ' : 'Joined'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {language === 'th' ? 'การจัดการ' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                          {user.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-xs text-gray-500">@{user.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                        user.role === 'technician' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                        'bg-green-100 text-green-800 border-green-200'
                      }>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={user.status === 'Active' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.joiningDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 bg-white shadow-lg border border-gray-200">
                          <DropdownMenuItem 
                            onClick={() => handleManageRoles(user)}
                            className="cursor-pointer hover:bg-gray-100"
                          >
                            <Shield className="mr-2 h-4 w-4" />
                            <span>{language === 'th' ? 'จัดการบทบาท' : 'Manage Role'}</span>
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem 
                            onClick={() => handleManageAssetRoles(user)}
                            className="cursor-pointer hover:bg-gray-100"
                          >
                            <UserCog className="mr-2 h-4 w-4" />
                            <span>{language === 'th' ? 'จัดการบทบาททรัพย์สิน' : 'Asset Management Role'}</span>
                          </DropdownMenuItem>
                          
                          <DropdownMenuSeparator />
                          
                          <DropdownMenuItem 
                            onClick={() => handleEditUser(user)}
                            className="cursor-pointer hover:bg-gray-100"
                          >
                            <PenLine className="mr-2 h-4 w-4" />
                            <span>{language === 'th' ? 'แก้ไขผู้ใช้' : 'Edit User'}</span>
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem 
                            onClick={() => handleDeleteUser(user)}
                            className="cursor-pointer text-red-600 focus:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>{language === 'th' ? 'ลบผู้ใช้' : 'Delete User'}</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    {language === 'th' ? 'ไม่พบผู้ใช้' : 'No users found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <UserRoleModal 
        user={selectedUser} 
        isOpen={showRoleModal} 
        onClose={handleCloseRoleModal} 
        onSave={handleSaveRole}
      />

      <AssetRoleManagementModal
        user={selectedUser}
        isOpen={showAssetRoleModal}
        onClose={handleCloseAssetRoleModal}
        onSave={handleSaveAssetRole}
      />
    </DashboardLayout>
  );
};

export default Users;
