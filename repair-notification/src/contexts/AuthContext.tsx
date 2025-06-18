import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/types";
import apiClient from "@/services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import Swal from "sweetalert2";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (
    username: string,
    password: string,
    rememberMe?: boolean
  ) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: any) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  checkPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // State to hold user data and loading status   สถานะเพื่อเก็บข้อมูลผู้ใช้และสถานะการโหลด
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Function to handle login  ฟังก์ชั่นสำหรับจัดการการเข้าสู่ระบบ
  const login = async (
    username: string,
    password: string,
    rememberMe?: boolean
  ) => {
    try {
      setLoading(true);
      console.log("Attempting login with:", username);
      const response = await apiClient.login(username, password); // Call the API to log-in

      // Map the API response to our User type
      const userData: User = {
        id: response.user.id || response.user.email,
        username: response.user.userName || response.user.email.split("@")[0],
        name: response.user.fullName,
        email: response.user.email,
        // Map the role - ensure it's lowercase to match our app's expectations
        role: response.user.role.toLowerCase() as
          | "admin"
          | "technician"
          | "user",
        // Department info comes in a nested object
        department: response.user.department?.department_name || "",
      };

      console.log("Login successful, user data:", userData);

      // Save user to state and localStorage
      setUser(userData);

      //rememberMe
      if (rememberMe) {
        localStorage.setItem("user", JSON.stringify(userData));
        sessionStorage.removeItem("user");
      } else {
        sessionStorage.setItem("user", JSON.stringify(userData));
        localStorage.removeItem("user");
      }

      Swal.fire({
        icon: "success",
        title: "Login successful!",
        text: `Welcome back, ${userData.name}`,
        timer: 1500,
        showConfirmButton: false,
      });

      //  navigate dashboard after setting the user state
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text:
          error instanceof Error
            ? error.message
            : "An error occurred during login",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Function to handle logout --ฟังก์ชั่นสำหรับจัดการการออกจากระบบ
  const logout = async () => {
    try {
      setLoading(true);
      apiClient.logout();
      setUser(null);
      navigate("/login");

      toast({
        title: "Logged out successfully",
        variant: "default",
      });
    } catch (error) {
      console.error("Logout error:", error);
      // Even if API call fails, log out locally
      setUser(null);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle user registration --ฟังก์ชั่นสำหรับจัดการการลงทะเบียนผู้ใช้
  const register = async (userData: any): Promise<void> => {
    try {
      setLoading(true);
      console.log("AuthContext register method called with:", userData);

      // Call the API to register the user
      const result = await apiClient.register(userData);
      console.log("Registration result:", result);

      await Swal.fire({
        icon: "success",
        title: "Registration successful!",
        text: result.message || "You can now log in with your credentials",
        timer: 2000,
        showConfirmButton: false,
      });

      navigate("/login");
      return;
    } catch (error: any) {
      console.error("Registration error in AuthContext:", error);

      await Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text:
          error instanceof Error
            ? error.message
            : "An error occurred during registration",
        timer: 2500,
        showConfirmButton: false,
      });

      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Function to handle forgot password --ฟังก์ชั่นสำหรับจัดการลืมรหัสผ่าน
  const forgotPassword = async (email: string) => {
    try {
      setLoading(true);
      await apiClient.forgotPassword(email);

      toast({
        title: "Password Reset Email Sent",
        description: "Please check your email to reset your password",
        variant: "default",
      });

      navigate("/login");
    } catch (error) {
      toast({
        title: "Password Reset Failed",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred during password reset",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Function to handle password reset --ฟังก์ชั่นสำหรับจัดการการรีเซ็ตรหัสผ่าน
  const resetPassword = async (token: string, password: string) => {
    try {
      setLoading(true);
      await apiClient.resetPassword(token, password);

      toast({
        title: "Password Reset Successful",
        description: "You can now log in with your new password",
        variant: "default",
      });

      navigate("/login");
    } catch (error) {
      toast({
        title: "Password Reset Failed",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred during password reset",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Helper function to check if user has permission --ฟังก์ชั่นช่วยตรวจสอบว่าผู้ใช้มีสิทธิ์หรือไม่
  const checkPermission = (permission: string): boolean => {
    if (!user) return false;

    // Map permissions based on roles
    const rolePermissions: Record<string, string[]> = {
      admin: ["admin", "technician", "user"], // Admin can do everything
      technician: ["technician", "user"], // Technician can do technician and user things
      user: ["user"], // User can only do user things
    };

    const userRole = user.role.toLowerCase();
    const allowedRoles = rolePermissions[userRole] || [];

    return allowedRoles.includes(permission.toLowerCase());
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        register,
        forgotPassword,
        resetPassword,
        checkPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
