import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import apiClient from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { useRoleBasedApi } from "./useRoleBasedApi";
import axios from "axios";
import Swal from "sweetalert2";

export const useRepairRequests = () => {
  const [repairRequests, setRepairRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<any>({});
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const { role } = useRoleBasedApi();

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL; // เรียกใช้ URL จาก environment variable

  // Fetch repair requests based on user role
  const fetchRepairRequests = async () => {

    console.log("Current role:", role);

    try {
      setIsLoading(true);

      let data;
      // Use the correct API endpoint based on user role
      if (role === "ADMIN") {
        // ใช้ axios แทน fetch
        const response = await axios.get(`${API_BASE_URL}/admin/repairs`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        data = response.data;
      } else {
        data = await apiClient.getRepairRequests();
      }

      if (Array.isArray(data)) {
        setRepairRequests(data);
      } else if (data && Array.isArray(data.data)) {
        setRepairRequests(data.data);
      } else {
        setRepairRequests([]);
      }
    } catch (error) {
      console.error("Error fetching repair requests:", error);
      setRepairRequests([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      setIsStatsLoading(true);
      const data = await apiClient.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      setStats({
        totalRequests: 0,
        pendingRequests: 0,
        inProgressRequests: 0,
        completedRequests: 0,
      });
    } finally {
      setIsStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchRepairRequests();
    fetchDashboardStats();
  }, []);

  const refetch = () => {
    fetchRepairRequests();
    fetchDashboardStats();
  };

  const handleViewDetails = (request: any) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const handleEditRequest = (request: any) => {
    setSelectedRequest(request);
    setShowEditModal(true);
  };

  //delete การแจ้งซ่อม
  const handleDeleteRequest = async (id: string) => {
    try {
      {
        const result = await Swal.fire({
          title: language === "th" ? "ยืนยันการลบ" : "Confirm Delete",
          text:
            language === "th"
              ? "คุณต้องการลบรายการนี้ใช่หรือไม่?"
              : "Are you sure you want to delete this request?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: language === "th" ? "ใช่, ลบ!" : "Yes, delete!",
          cancelButtonText: language === "th" ? "ไม่" : "No",
        });

        if (!result.isConfirmed) return;

        setIsLoading(true);

        if (role === "admin") {
          // ใช้ axios DELETE
          await axios.delete(`${API_BASE_URL}/admin/delete-repair/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
        } else {
          await apiClient.deleteRepairRequest(id);
        }

        setRepairRequests((prev) =>
          prev.filter((request) => request.id !== id)
        );
        await Swal.fire({
          icon: "success",
          title: language === "th" ? "สำเร็จ" : "Success",
          text:
            language === "th"
              ? "ลบคำขอเรียบร้อยแล้ว"
              : "Request deleted successfully",
          timer: 1500,
          showConfirmButton: false,
        });
        refetch();
      }
    } catch (error) {
      console.error("Error deleting repair request:", error);
     Swal.fire({
      icon: "error",
      title: language === "th" ? "ผิดพลาด" : "Error",
      text: language === "th"
        ? "ไม่สามารถลบคำขอได้"
        : "Could not delete request",
    });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      setIsLoading(true);

      if (role === "admin") {
        // ใช้ axios PUT
        await axios.put(
          `${API_BASE_URL}/admin/repair/${id}`,
          { status },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await axios.put(
          `${API_BASE_URL}/repair/update-status/${id}`,
          { status },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }

      setRepairRequests((prev) =>
        prev.map((request) =>
          request.id === id ? { ...request, status } : request
        )
      );
      toast.success(
        language === "th"
          ? "อัพเดทสถานะเรียบร้อยแล้ว"
          : "Status updated successfully"
      );
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(
        language === "th"
          ? "ไม่สามารถอัพเดทสถานะได้"
          : "Could not update status"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Add the self approve function with proper return type
  const handleSelfApproveRepairRequest = async (
    requestId: string,
    remarks: string
  ): Promise<boolean> => {
    try {
      setIsLoading(true);

      if (role === "admin") {
        await axios.put(
          `${API_BASE_URL}/admin/repair/approve/${requestId}`,
          { remarks },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await axios.put(
          `${API_BASE_URL}/repair/approve/${requestId}`,
          { remarks },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }

      toast.success(
        language === "th"
          ? "อนุมัติคำขอซ่อมเรียบร้อยแล้ว"
          : "Repair request approved successfully"
      );
      refetch();
      return true;
    } catch (error) {
      console.error("Error approving repair request:", error);
      toast.error(
        language === "th"
          ? "ไม่สามารถอนุมัติคำขอซ่อมได้"
          : "Could not approve repair request"
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    repairRequests,
    stats,
    isLoading,
    isStatsLoading,
    refetch,
    selectedRequest,
    showDetailsModal,
    showEditModal,
    setSelectedRequest,
    setShowDetailsModal,
    setShowEditModal,
    handleViewDetails,
    handleEditRequest,
    handleDeleteRequest,
    handleUpdateStatus,
    handleSelfApproveRepairRequest,
  };
};
