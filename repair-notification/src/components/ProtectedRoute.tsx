
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = [],
  redirectTo = '/login'
}) => {
  const { user, loading, checkPermission } = useAuth();
  
  // Show loading 
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // If not logged in, redirect to login หากไม่ได้เข้าสู่ระบบ ให้เปลี่ยนเส้นทางไปที่เข้าสู่ระบบ
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }
  
  // If no specific roles are required, allow access
  if (allowedRoles.length === 0) {
    return <>{children}</>;
  }
  
  // Check if user has any of the allowed roles
  const hasPermission = allowedRoles.some(role => checkPermission(role));
  
  // If roles specified and user doesn't have permission
  if (!hasPermission) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  // Render children if user has permission
  return <>{children}</>;
};

export default ProtectedRoute;
