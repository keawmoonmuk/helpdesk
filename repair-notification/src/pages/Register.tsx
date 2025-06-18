import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { FileText } from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import apiClient from "@/services/api"; // เรียน apiClient  จาก api.ts
import { string } from "zod";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    departmentId: "",
    role: "user",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [departments, setDepartments] = useState<
    { value: string; label: string }[]
  >([]); //เก็บข้อมูลแผนกจาก API
  const { register, loading } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleDepartmentChange = (value: string) => {
    setFormData((prev) => ({ ...prev, departmentId: value }));

    if (formErrors.departmentId) {
      setFormErrors((prev) => {
        const updated = { ...prev };
        delete updated.departmentId;
        return updated;
      });
    }
  };

  // ฟังก์ชันสำหรับตรวจสอบความถูกต้องของฟอร์ม
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.username.trim()) errors.username = t("validation.required");
    if (!formData.fullName.trim()) errors.fullName = t("validation.required");
    if (!formData.email.trim()) errors.email = t("validation.required");
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errors.email = t("validation.invalidEmail");
    if (!formData.password.trim()) errors.password = t("validation.required");
    if (!formData.departmentId) errors.departmentId = t("validation.required");

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: t("validation.error"),
        description: t("validation.checkFields"),
        variant: "destructive",
      });
      return;
    }

    try {
      // Map form fields to API expected format
      const userData = {
        username: formData.username,
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        departmentId: formData.departmentId,
        role: formData.role,
      };

      console.log("Submitting registration data:", userData);
      await register(userData);

      toast({
        title: t("register.success"),
        description: t("register.successMessage"),
      });
    } catch (error: any) {
      console.error("Registration error:", error);

      toast({
        title: t("register.failed"),
        description: error.message || t("register.failedMessage"),
        variant: "destructive",
      });
    }
  };

  // ฟังก์ชันสำหรับดึงข้อมูลแผนกจาก API
  const fetchDepartments = async () => {
    try {
      const departmentData = await apiClient.getDepartments();

      setDepartments(departmentData); // เก็บข้อมูลแผนกจาก API
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast({
        title: t("register.error"),
        description: t("register.departmentError"),
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchDepartments(); // เรียกใช้ฟังก์ชัน fetchDepartments เมื่อคอมโพเนนต์โหลด
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 py-12">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <div className="flex justify-end mb-4">
          <LanguageSwitcher />
        </div>

        <div className="text-center mb-6">
          <FileText className="h-12 w-12 text-blue-500 mx-auto" />
          <h1 className="mt-4 text-2xl font-bold">{t("register.title")}</h1>
          <p className="text-gray-600">{t("register.subtitle")}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("register.username")}
            </label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder={t("register.usernamePlaceholder")}
              className={formErrors.username ? "border-red-500" : ""}
              value={formData.username}
              onChange={handleChange}
            />
            {formErrors.username && (
              <p className="mt-1 text-sm text-red-500">{formErrors.username}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("register.fullName")}
            </label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              placeholder={t("register.fullNamePlaceholder")}
              className={formErrors.fullName ? "border-red-500" : ""}
              value={formData.fullName}
              onChange={handleChange}
            />
            {formErrors.fullName && (
              <p className="mt-1 text-sm text-red-500">{formErrors.fullName}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("register.email")}
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder={t("register.emailPlaceholder")}
              className={formErrors.email ? "border-red-500" : ""}
              value={formData.email}
              onChange={handleChange}
            />
            {formErrors.email && (
              <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("register.password")}
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder={t("register.passwordPlaceholder")}
              className={formErrors.password ? "border-red-500" : ""}
              value={formData.password}
              onChange={handleChange}
            />
            {formErrors.password && (
              <p className="mt-1 text-sm text-red-500">{formErrors.password}</p>
            )}
          </div>
          {/* เลือกแผนก */}
          <div className="mb-4">
            <label
              htmlFor="departmentId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("register.department")}
            </label>
            <Select
              value={formData.departmentId}
              onValueChange={handleDepartmentChange}
            >
              <SelectTrigger
                className={formErrors.departmentId ? "border-red-500" : ""}
              >
                <SelectValue
                  placeholder={t("register.departmentPlaceholder")}
                />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.value} value={dept.value}>
                    {dept.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formErrors.departmentId && (
              <p className="mt-1 text-sm text-red-500">
                {formErrors.departmentId}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("register.role")}
            </label>
            <select
              id="role"
              name="role"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="user">{t("register.roleUser")}</option>
              <option value="technician">{t("register.roleTechnician")}</option>
              <option value="admin">{t("register.roleAdmin")}</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                {t("register.processing")}
              </div>
            ) : (
              t("register.signUp")
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {t("register.haveAccount")}{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              {t("register.signIn")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
