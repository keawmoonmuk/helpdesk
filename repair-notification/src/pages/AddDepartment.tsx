import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building, ArrowLeft, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRoleBasedApi } from "@/hooks/useRoleBasedApi";
import { useAuth } from "@/contexts/AuthContext";
import Swal from "sweetalert2";

const AddDepartment = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [departmentName, setDepartmentName] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { departments } = useRoleBasedApi();
  const { user } = useAuth();

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api'; // ใช้ค่าจาก .env หรือ fallback เป็น localhost

  console.log("API_BASE_URL", API_BASE_URL);
  

  // summit
  const handleSubmit = async (e: React.FormEvent) => {

    console.log("API_BASE_URL deparetment", API_BASE_URL);


    e.preventDefault();

    if (!departmentName) {
      Swal.fire({
        icon: "error",
        title: language === "th" ? "เกิดข้อผิดพลาด" : "Error",
        text:
          language === "th"
            ? "กรุณากรอกชื่อแผนก"
            : "Please enter department name",
      });
      return;
    }

    // Check if user is admin
    if (user?.role !== "admin") {
      Swal.fire({
        icon: "error",
        title: language === "th" ? "สิทธิ์ไม่เพียงพอ" : "Permission Denied",
        text:
          language === "th"
            ? "คุณไม่มีสิทธิ์ในการเพิ่มแผนก"
            : "You do not have permission to add departments",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Attempting to add department:", { departmentName });
      console.log("Departments API object:", departments);

      if (!departments) {
        throw new Error("Department API not available");
      }

      const response = await fetch(`${API_BASE_URL}/admin/add-department`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ departmentName: departmentName.toUpperCase() }),
      });

      // Make direct API call using apiClient
      // const response = await fetch('http://localhost:5000/api/admin/add-department', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   },
      //   //body: JSON.stringify({ departmentName })
      //   body: JSON.stringify({ departmentName: departmentName.toUpperCase() })

      // });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add department");
      }

      const data = await response.json();
      console.log("API response:", data);

      Swal.fire({
        icon: "success",
        title: language === "th" ? "สำเร็จ" : "Success",
        text:
          language === "th"
            ? `เพิ่มแผนก "${departmentName}" เรียบร้อยแล้ว`
            : `Department "${departmentName}" added successfully`,
        timer: 1500,
        showConfirmButton: false,
      });

      // Navigate back to departments page after successful creation
      setTimeout(() => {
        navigate("/departments");
      }, 1000);
    } catch (error) {
      console.error("Failed to add department:", error);
      Swal.fire({
        icon: "error",
        title: language === "th" ? "เกิดข้อผิดพลาด" : "Error",
        text:
          language === "th"
            ? `ไม่สามารถเพิ่มแผนกได้: ${(error as Error).message}`
            : `Failed to add department: ${(error as Error).message}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout title={language === "th" ? "เพิ่มแผนก" : "Add Department"}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" className="mr-2" asChild>
            <a href="/departments">
              <ArrowLeft className="h-4 w-4 mr-1" />
              {language === "th"
                ? "กลับไปยังรายการแผนก"
                : "Back to Departments"}
            </a>
          </Button>
          <h1 className="text-2xl font-bold flex items-center">
            <Building className="mr-2 h-6 w-6 text-blue-600" />
            {language === "th" ? "เพิ่มแผนกใหม่" : "Add New Department"}
          </h1>
        </div>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>
            {language === "th" ? "ข้อมูลแผนก" : "Department Information"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">
                {language === "th" ? "ชื่อแผนก" : "Department Name"}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
                placeholder={
                  language === "th"
                    ? "เช่น ฝ่ายการตลาด, ฝ่ายไอที"
                    : "e.g. Marketing, IT Department"
                }
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">
                {language === "th" ? "สถานที่ตั้ง" : "Location"}
              </Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={
                  language === "th"
                    ? "เช่น ชั้น 3, อาคาร A"
                    : "e.g. 3rd Floor, Building A"
                }
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">
                {language === "th" ? "หมายเหตุ" : "Notes"}
              </Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={
                  language === "th"
                    ? "รายละเอียดเพิ่มเติมเกี่ยวกับแผนก"
                    : "Additional details about the department"
                }
                className="min-h-[100px]"
                disabled={isSubmitting}
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button
                variant="outline"
                type="button"
                className="mr-2"
                onClick={() => navigate("/departments")}
                disabled={isSubmitting}
              >
                {language === "th" ? "ยกเลิก" : "Cancel"}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {language === "th" ? "กำลังบันทึก..." : "Saving..."}
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-1" />
                    {language === "th" ? "เพิ่มแผนก" : "Add Department"}
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

export default AddDepartment;
