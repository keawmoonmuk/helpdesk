
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, Settings, FileText, Bell, Calendar, LogOut, 
  Wrench, User, ChevronRight, Building, Database,
  Users, BarChart4, ClipboardList, FolderPlus, FilePlus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import LanguageSwitcher from './LanguageSwitcher';
import { Badge } from "@/components/ui/badge";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { t, language } = useLanguage();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const notificationCount = 5;
  
  const upcomingEvents = 3;
  
  const pendingReports = 2;
  
  const commonNavItems = [
    { 
      path: '/dashboard', 
      label: language === 'th' ? 'แดชบอร์ด' : t('sidebar.dashboard'), 
      icon: <Home className="h-5 w-5" />, 
      roles: ['admin', 'technician', 'user'],
      badge: null
    },
    { 
      path: '/notifications', 
      label: language === 'th' ? 'การแจ้งเตือน' : t('sidebar.notifications'), 
      icon: <Bell className="h-5 w-5" />, 
      roles: ['admin', 'technician', 'user'],
      badge: notificationCount
    },
    { 
      path: '/schedule', 
      label: language === 'th' ? 'ตารางเวลา' : t('sidebar.schedule'), 
      icon: <Calendar className="h-5 w-5" />, 
      roles: ['admin', 'technician', 'user'],
      badge: upcomingEvents
    },
    { 
      path: '/reports', 
      label: language === 'th' ? 'รายงาน' : t('sidebar.reports'), 
      icon: <FileText className="h-5 w-5" />, 
      roles: ['admin', 'technician', 'user'],
      badge: pendingReports
    },
    { 
      path: '/settings', 
      label: t('sidebar.settings'), 
      icon: <Settings className="h-5 w-5" />, 
      roles: ['admin', 'technician', 'user'],
      badge: null
    }
  ];

  const technicianNavItems = [
    { 
      path: '/tasks', 
      label: language === 'th' ? 'งานของฉัน' : t('sidebar.myTasks'), 
      icon: <Wrench className="h-5 w-5" />, 
      roles: ['technician', 'admin'],
      badge: null
    },
  ];

  const adminNavItems = [
    { 
      path: '/departments', 
      label: language === 'th' ? 'แผนก' : 'Departments', 
      icon: <Building className="h-5 w-5" />, 
      roles: ['admin'],
      badge: null
    },
    { 
      path: '/users', 
      label: language === 'th' ? 'ผู้ใช้งาน' : 'Users', 
      icon: <Users className="h-5 w-5" />, 
      roles: ['admin'],
      badge: null
    },
    { 
      path: '/assets', 
      label: language === 'th' ? 'ทรัพย์สิน' : 'Assets', 
      icon: <Database className="h-5 w-5" />, 
      roles: ['admin'],
      badge: null
    },
  ];

  const userNavItems = [
    { 
      path: '/my-assets', 
      label: language === 'th' ? 'ทรัพย์สินของฉัน' : 'My Assets', 
      icon: <Database className="h-5 w-5" />, 
      roles: ['user'],
      badge: null
    },
  ];

  let navItems = [...commonNavItems];
  
  if (user?.role === 'technician') {
    navItems = [...technicianNavItems, ...commonNavItems];
  } else if (user?.role === 'admin') {
    navItems = [...commonNavItems, ...adminNavItems, ...technicianNavItems];
  } else if (user?.role === 'user') {
    navItems = [...commonNavItems, ...userNavItems];
  }
  
  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(user?.role || '')
  );

  const getRoleName = (role: string) => {
    switch (role) {
      case 'admin':
        return language === 'th' ? 'ผู้ดูแลระบบ' : 'Administrator';
      case 'technician':
        return language === 'th' ? 'ช่างเทคนิค' : 'Technician';
      case 'user':
        return language === 'th' ? 'ผู้ใช้งาน' : 'User';
      default:
        return role;
    }
  };

  return (
    <div className="h-screen bg-white border-r border-gray-200 w-64 flex flex-col">
      <div className="flex items-center px-5 h-16 border-b border-gray-200">
        <Link to="/dashboard" className="text-blue-600 font-bold text-lg flex items-center">
          <Wrench className="h-5 w-5 mr-2" />
          <span>{language === 'th' ? 'แจ้งซ่อม' : t('sidebar.repairNotify')}</span>
        </Link>
      </div>
      
      <div className="px-5 py-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <User className="h-6 w-6" />
          </div>
          <div className="ml-3">
            <p className="font-medium text-sm">{user?.name || (language === 'th' ? 'ผู้ใช้งาน' : t('sidebar.user'))}</p>
            <p className="text-xs text-gray-500 capitalize">{getRoleName(user?.role || '')}</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {filteredNavItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center justify-between px-4 py-2.5 text-sm font-medium rounded-md group",
                  isActive(item.path)
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <div className="flex items-center">
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </div>
                {item.badge ? (
                  <span className="inline-flex items-center justify-center h-5 min-w-5 px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    {item.badge}
                  </span>
                ) : isActive(item.path) ? (
                  <ChevronRight className="h-4 w-4 opacity-70" />
                ) : null}
              </Link>
            </li>
          ))}
        </ul>

        {user?.role === 'admin' && (
          <div className="mt-6 px-3">
            <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {language === 'th' ? 'การดำเนินการด่วน' : 'Quick Actions'}
            </h3>
            <div className="mt-2 space-y-1">
              <Link to="/create-repair" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                <FilePlus className="h-4 w-4 text-blue-600 mr-2" />
                {language === 'th' ? 'สร้างคำขอซ่อม' : 'Create Repair Request'}
              </Link>
              <Link to="/add-department" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                <FolderPlus className="h-4 w-4 text-blue-600 mr-2" />
                {language === 'th' ? 'เพิ่มแผนก' : 'Add Department'}
              </Link>
              <Link to="/add-user" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                <Users className="h-4 w-4 text-blue-600 mr-2" />
                {language === 'th' ? 'เพิ่มผู้ใช้' : 'Add User'}
              </Link>
            </div>
          </div>
        )}

        {user?.role === 'technician' && (
          <div className="mt-6 px-3">
            <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {language === 'th' ? 'งานกำลังดำเนินการ' : 'In Progress'}
            </h3>
            <div className="mt-2 space-y-1">
              <div className="px-4 py-2 text-sm text-gray-700 rounded-md">
                <div className="flex items-center justify-between">
                  <span className="flex items-center">
                    <ClipboardList className="h-4 w-4 text-yellow-600 mr-2" />
                    {language === 'th' ? 'งานซ่อม #123' : 'Repair #123'}
                  </span>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    {language === 'th' ? 'กำลังดำเนินการ' : 'In Progress'}
                  </Badge>
                </div>
                <div className="text-xs text-gray-500 mt-1 ml-6">
                  {language === 'th' ? 'ติดตั้งเมื่อ 2 ชม. ที่แล้ว' : 'Started 2 hours ago'}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <LanguageSwitcher variant="sidebar" />
        
        <button
          onClick={logout}
          className="flex items-center text-red-600 text-sm font-medium hover:text-red-700 mt-4 w-full px-4 py-2 rounded-md hover:bg-gray-100"
        >
          <LogOut className="h-4 w-4 mr-2" />
          {language === 'th' ? 'ออกจากระบบ' : t('sidebar.logout')}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
