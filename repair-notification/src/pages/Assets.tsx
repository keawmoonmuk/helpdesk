
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Database, Plus, Server, Laptop, Printer, UserCog, Search, Filter, Clock, Check, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useRepairRequests } from "@/hooks/useRepairRequests";
import AddAssetModal from "@/components/AddAssetModal";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AssetManagementRole, User } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const AssetManagersTable = () => {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterDepartment, setFilterDepartment] = useState("all");

  // Sample data for asset managers
  const assetManagers: AssetManagementRole[] = [
    {
      id: "am1",
      userId: 1,
      userName: "John Doe",
      userEmail: "john.doe@example.com",
      roleName: "asset-manager",
      department: "IT",
      assignedDate: "2023-01-15",
      expiryDate: "2024-01-15",
      permissions: ["create", "update", "delete", "assign", "report"],
      active: true
    },
    {
      id: "am2",
      userId: 2,
      userName: "Sarah Johnson",
      userEmail: "sarah.j@example.com",
      roleName: "asset-staff",
      department: "Finance",
      assignedDate: "2023-02-10",
      permissions: ["view", "update"],
      active: true
    },
    {
      id: "am3",
      userId: 5,
      userName: "Robert Wilson",
      userEmail: "robert.w@example.com",
      roleName: "it-manager",
      department: "IT",
      assignedDate: "2023-03-22",
      expiryDate: "2024-03-22",
      permissions: ["create", "update", "maintain", "report"],
      active: true
    }
  ];

  const filterAssetManagers = assetManagers.filter(manager => {
    const matchesSearch = 
      manager.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      manager.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === "all" || manager.roleName === filterRole;
    const matchesDepartment = filterDepartment === "all" || manager.department === filterDepartment;
    
    return matchesSearch && matchesRole && matchesDepartment;
  });

  const translateRole = (role: string) => {
    switch (role) {
      case "asset-manager":
        return language === 'th' ? 'ผู้จัดการทรัพย์สิน' : 'Asset Manager';
      case "asset-staff":
        return language === 'th' ? 'เจ้าหน้าที่ทรัพย์สิน' : 'Asset Staff';
      case "it-manager":
        return language === 'th' ? 'ผู้ดูแลทรัพย์สิน IT' : 'IT Asset Manager';
      default:
        return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "asset-manager":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "asset-staff":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "it-manager":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleBgColor = (role: string) => {
    switch (role) {
      case "asset-manager":
        return "bg-purple-50";
      case "asset-staff":
        return "bg-blue-50";
      case "it-manager":
        return "bg-green-50";
      default:
        return "bg-gray-50";
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleEditRole = (manager: AssetManagementRole) => {
    toast.info(
      language === 'th'
        ? `กำลังแก้ไขบทบาทของ ${manager.userName}`
        : `Editing role for ${manager.userName}`
    );
  };

  const handleRevokeRole = (manager: AssetManagementRole) => {
    toast.success(
      language === 'th'
        ? `ยกเลิกบทบาทของ ${manager.userName} สำเร็จ`
        : `Role for ${manager.userName} revoked successfully`
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder={language === 'th' ? 'ค้นหาตามชื่อหรืออีเมล...' : 'Search by name or email...'}
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
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
                <SelectItem value="IT">IT</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Card view for managers instead of a table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filterAssetManagers.length > 0 ? (
          filterAssetManagers.map((manager) => (
            <Card key={manager.id} className={`border border-gray-200 shadow-sm hover:shadow-md transition-shadow ${getRoleBgColor(manager.roleName)}`}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium mr-3">
                      {manager.userName.charAt(0)}
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold">{manager.userName}</CardTitle>
                      <CardDescription className="text-sm">{manager.userEmail}</CardDescription>
                    </div>
                  </div>
                  <Badge className={getRoleColor(manager.roleName)}>
                    {translateRole(manager.roleName)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">{language === 'th' ? 'แผนก' : 'Department'}:</span>
                    <span className="font-medium">{manager.department}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{language === 'th' ? 'วันที่มอบหมาย' : 'Assigned Date'}:</span>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 text-gray-400 mr-1" /> 
                      <span className="font-medium">{formatDate(manager.assignedDate)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">{language === 'th' ? 'วันหมดอายุ' : 'Expiry Date'}:</span>
                    <span className="font-medium">
                      {manager.expiryDate 
                        ? formatDate(manager.expiryDate) 
                        : <span className="text-gray-500 italic">{language === 'th' ? 'ไม่มีวันหมดอายุ' : 'No expiration'}</span>
                      }
                    </span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <span className="text-sm text-gray-500 mb-1 block">{language === 'th' ? 'สิทธิ์' : 'Permissions'}:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {manager.permissions.map(perm => (
                      <TooltipProvider key={perm}>
                        <Tooltip>
                          <TooltipTrigger>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                              {perm}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">
                              {perm === 'create' && (language === 'th' ? 'สร้างทรัพย์สิน' : 'Create assets')}
                              {perm === 'update' && (language === 'th' ? 'แก้ไขทรัพย์สิน' : 'Update assets')}
                              {perm === 'delete' && (language === 'th' ? 'ลบทรัพย์สิน' : 'Delete assets')}
                              {perm === 'assign' && (language === 'th' ? 'มอบหมายทรัพย์สิน' : 'Assign assets')}
                              {perm === 'report' && (language === 'th' ? 'สร้างรายงาน' : 'Generate reports')}
                              {perm === 'view' && (language === 'th' ? 'ดูทรัพย์สิน' : 'View assets')}
                              {perm === 'maintain' && (language === 'th' ? 'ดูแลทรัพย์สิน' : 'Maintain assets')}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2 pt-0">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                  onClick={() => handleEditRole(manager)}
                >
                  <Check className="h-4 w-4 mr-1" />
                  {language === 'th' ? 'แก้ไข' : 'Edit'}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => handleRevokeRole(manager)}
                >
                  <X className="h-4 w-4 mr-1" />
                  {language === 'th' ? 'ยกเลิก' : 'Revoke'}
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-8 bg-gray-50 rounded-lg">
            <div className="text-gray-500">
              {language === 'th' ? 'ไม่พบผู้จัดการทรัพย์สิน' : 'No asset managers found'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Assets = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { stats } = useRepairRequests();
  const [showAddAssetModal, setShowAddAssetModal] = useState(false);
  const [activeTab, setActiveTab] = useState("assets");

  const assetTypes = [
    { name: language === 'th' ? 'คอมพิวเตอร์' : 'Computers', count: 24, icon: <Laptop className="h-8 w-8 text-blue-500" /> },
    { name: language === 'th' ? 'เครื่องพิมพ์' : 'Printers', count: 8, icon: <Printer className="h-8 w-8 text-green-500" /> },
    { name: language === 'th' ? 'เซิร์ฟเวอร์' : 'Servers', count: 3, icon: <Server className="h-8 w-8 text-purple-500" /> },
    { name: language === 'th' ? 'อุปกรณ์อื่นๆ' : 'Other Devices', count: 15, icon: <Database className="h-8 w-8 text-amber-500" /> },
  ];

  const handleAddAsset = async (assetData: any) => {
    console.log('Adding new asset:', assetData);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success(
      language === 'th' 
        ? 'เพิ่มทรัพย์สินเรียบร้อยแล้ว' 
        : 'Asset added successfully'
    );
    
    return Promise.resolve();
  };

  return (
    <DashboardLayout title={language === 'th' ? 'จัดการทรัพย์สิน' : 'Asset Management'}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <Database className="mr-2 h-6 w-6 text-blue-600" />
          {language === 'th' ? 'จัดการทรัพย์สินทั้งหมด' : 'All Assets Management'}
        </h1>
        <div className="flex gap-2">
          <Button 
            className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white shadow-sm transition-all hover:shadow-md"
            onClick={() => setActiveTab("managers")}
          >
            <UserCog className="h-4 w-4" />
            {language === 'th' ? 'จัดการบทบาท' : 'Manage Roles'}
          </Button>
          <Button 
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all hover:shadow-md"
            onClick={() => setShowAddAssetModal(true)}
          >
            <Plus className="h-4 w-4" />
            {language === 'th' ? 'เพิ่มทรัพย์สินใหม่' : 'Add New Asset'}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="bg-white rounded-lg shadow-sm p-4">
        <TabsList className="mb-4 grid grid-cols-2 gap-4 bg-gray-100 p-1">
          <TabsTrigger value="assets" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Database className="h-4 w-4" />
            {language === 'th' ? 'ทรัพย์สิน' : 'Assets'}
          </TabsTrigger>
          <TabsTrigger value="managers" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <UserCog className="h-4 w-4" />
            {language === 'th' ? 'ผู้จัดการทรัพย์สิน' : 'Asset Managers'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assets" className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {assetTypes.map((type) => (
              <Card key={type.name} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    {type.icon}
                    <span className="ml-2">{type.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{type.count}</div>
                  <CardDescription>
                    {language === 'th' ? 'จำนวนทั้งหมด' : 'Total count'}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>
                {language === 'th' ? 'ทรัพย์สินที่มีการแจ้งซ่อมล่าสุด' : 'Recently Reported Assets'}
              </CardTitle>
              <CardDescription>
                {language === 'th' 
                  ? 'แสดงรายการทรัพย์สินที่มีการแจ้งซ่อมในช่วง 30 วันที่ผ่านมา' 
                  : 'Showing assets that have been reported for repair in the last 30 days'}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {language === 'th' ? 'รหัสทรัพย์สิน' : 'Asset Code'}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {language === 'th' ? 'ชื่อทรัพย์สิน' : 'Asset Name'}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {language === 'th' ? 'ประเภท' : 'Type'}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {language === 'th' ? 'แผนก' : 'Department'}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {language === 'th' ? 'จำนวนการแจ้งซ่อม' : 'Repair Count'}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {language === 'th' ? 'วันที่แจ้งซ่อมล่าสุด' : 'Last Reported'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">PC-001</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Dell Latitude 5420</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Computer</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Marketing</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">27/03/2023</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">PR-002</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">HP LaserJet Pro</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Printer</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Finance</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">25/03/2023</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">SV-003</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Dell PowerEdge R740</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Server</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">IT</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">22/03/2023</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="managers">
          <Card className="mb-6 shadow-md border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserCog className="h-5 w-5 mr-2 text-blue-600" />
                {language === 'th' ? 'ผู้จัดการทรัพย์สิน' : 'Asset Management Roles'}
              </CardTitle>
              <CardDescription>
                {language === 'th' 
                  ? 'จัดการผู้ใช้ที่มีบทบาทในการจัดการทรัพย์สิน แก้ไขสิทธิ์และความรับผิดชอบ' 
                  : 'Manage users with asset management roles, edit permissions and responsibilities'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AssetManagersTable />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Asset Modal */}
      <AddAssetModal 
        isOpen={showAddAssetModal}
        onClose={() => setShowAddAssetModal(false)}
        onAddAsset={handleAddAsset}
      />
    </DashboardLayout>
  );
};

export default Assets;
