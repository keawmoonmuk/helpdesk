import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import apiClient from "@/services/api";
import { toast } from "sonner";
import {
  repairRequestSchema,
  RepairRequestFormData,
} from "@/schemas/repairRequestSchema";
import { CreateRepairData } from "@/types";
import { useRoleBasedApi } from "./useRoleBasedApi";
import Swal from "sweetalert2";

//call api axios
import axios from "axios";

interface UseRepairRequestFormProps {
  onSuccess: () => void;
}

export const useRepairRequestForm = ({onSuccess,
}: UseRepairRequestFormProps) => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const { role } = useRoleBasedApi();

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  // Get current date in YYYY-MM-DD format
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];

  const form = useForm<RepairRequestFormData>({
    resolver: zodResolver(repairRequestSchema),
    defaultValues: {
      reportDate: formattedDate,
      reporterName: user?.name || "",
      department: "",
      building: "",
      floor: "",
      assetName: "",
      assetCode: "",
      assetLocation: "",
      serialNumber: "",
      problemDetails: "",
      priority: "Medium",
      images: [], // Add images field to match the schema
    },
  });

  // handle  submission
  const onSubmit = async (values: RepairRequestFormData) => {
    try {
      setLoading(true);

      // Convert to the format expected by the API
      const repairRequestData: CreateRepairData = {
        departmentId: values.department, // This should be departmentId from form
        building: values.building,
        floor: values.floor,
        assetName: values.assetName,
        assetSerial: values.serialNumber,
        assetCode: values.assetCode,
        assetLocation: values.assetLocation,
        detailRepair: values.problemDetails,
        importance: mapPriorityToImportance(values.priority),  //ความสำคัญ
        // status: "รอดำเนินการ", // ส่งเป็นภาษาไทยเสมอ
        status: mapStatusToBackend(values.status), // status
        // status: language === "th" ? "รอดำเนินการ" : "Waiting for action",
        images: values.images || [], // Add image URLs here from the form submission
      };

      console.log("Sending repair request data:", repairRequestData);

      // Use the correct endpoint based on user role
      if (role === "admin") {
        // ใช้ axios และ API_BASE_URL
        const response = await axios.post(
          `${API_BASE_URL}/admin/add-repair`,
          repairRequestData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("Admin API response:", response.data);
      } else {
        await apiClient.addRepairRequest(repairRequestData);
      }

      await Swal.fire({
        icon: "success",
        title: t("แจ้งซ่อมสำเร็จ"),
        timer: 1800,
        showConfirmButton: false,
      });
      onSuccess();
    } catch (error) {
      console.error("Error creating repair request:", error);
      await Swal.fire({
        icon: "error",
        title: t("แจ้งซ่อมไม่สำเร็จ"),
        text: error instanceof Error ? error.message : "",
        timer: 2200,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
    }
  };

  //  importance format expected by API
  const mapPriorityToImportance = (priority: string): string => {
    switch (priority) {
      case "High":
        return "สูง";
      case "Low":
        return "ต่ำ";
      default:
        return "ปานกลาง"; // Default to Medium
    }
  };

  const mapStatusToBackend = (status: string): string => {
  // เพิ่ม mapping ตามที่ backend รองรับ
  switch (status) {
    case "Waiting for action":
      return "รอดำเนินการ";
    case "In progress":
      return "กำลังดำเนินการ";
    case "Completed":
      return "เสร็จสิ้น";
    case "Cancelled":
      return "ยกเลิก";
    default:
      return "รอดำเนินการ";
  }
};


  return {
    form,
    onSubmit,
    loading,
    t,
    language,
  };
};
