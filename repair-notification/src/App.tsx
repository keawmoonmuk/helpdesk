
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import NotFound from './pages/NotFound';
import Settings from './pages/Settings';
import Tasks from './pages/Tasks';
import Notifications from './pages/Notifications';
import Schedule from './pages/Schedule';
import Reports from './pages/Reports';
import Departments from './pages/Departments';
import Index from './pages/Index';
import Users from './pages/Users';
import Assets from './pages/Assets';
import UserAssets from './pages/UserAssets';
import TechnicianTasks from './pages/TechnicianTasks'; 
import AddDepartment from './pages/AddDepartment';
import AddUser from './pages/AddUser';
import CreateRepair from './pages/CreateRepair';
import Unauthorized from './pages/Unauthorized';
import { Toaster } from './components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <LanguageProvider>
          <AuthProvider>
            <TooltipProvider>
              <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/welcome" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                
                {/* Routes for all authenticated ผู้ใช้งานทั้งหมด */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/notifications"
                  element={
                    <ProtectedRoute>
                      <Notifications />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/schedule"
                  element={
                    <ProtectedRoute>
                      <Schedule />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reports"
                  element={
                    <ProtectedRoute>
                      <Reports />
                    </ProtectedRoute>
                  }
                />
                
                {/* Routes สำหรับ user */}
                <Route
                  path="/my-assets"
                  element={
                    <ProtectedRoute>
                      <UserAssets />
                    </ProtectedRoute>
                  }
                />
                
                {/* Routes for technicians and admins */}
                <Route
                  path="/tasks"
                  element={
                    <ProtectedRoute allowedRoles={['technician', 'admin']}>
                      <TechnicianTasks />
                    </ProtectedRoute>
                  }
                />
                
                {/* Admin-only routes */}
                <Route
                  path="/departments"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <Departments />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/assets"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <Assets />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/users"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <Users />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/add-department"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AddDepartment />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/add-user"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AddUser />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/create-repair"
                  element={
                    <ProtectedRoute>
                      <CreateRepair />
                    </ProtectedRoute>
                  }
                />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster position="top-right" />
            </TooltipProvider>
          </AuthProvider>
        </LanguageProvider>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
