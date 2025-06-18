import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Edit,
  Trash2,
  Plus,
  Eye,
  CheckCircle,
  Building,
  Calendar,
  User,
  MapPin,
  Package,
  Info,
  Clock,
  Database,
  Laptop,
  Printer,
  Server,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import RepairDetailsModal from "@/components/RepairDetailsModal";
import AddRepairRequestModal from "@/components/AddRepairRequestModal";
import EditRepairForm from "@/components/EditRepairForm";
import { useRepairRequests } from "@/hooks/useRepairRequests";
import RepairStatusBadge from "@/components/RepairStatusBadge";
import PriorityBadge from "@/components/PriorityBadge";
import DashboardStatsCards from "@/components/DashboardStatsCards";
import EmptyRepairState from "@/components/EmptyRepairState";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import AssetManagementModal from "@/components/AssetManagementModal";
import { toast } from "sonner";
import SupervisorApprovalModal from "@/components/SupervisorApprovalModal";
import { UserAsset } from "@/types";
import Swal from "sweetalert2";

const mockUserAssets: UserAsset[] = [
  {
    id: "1",
    assetName: "Dell Latitude 5420",
    assetCode: "PC-00123",
    assetLocation: "ฝ่ายการตลาด ชั้น 3",
    serialNumber: "HF78R42",
    assetType: "computer",
    userId: "user123",
    manufacturer: "Dell",
    model: "Latitude 5420",
  },
  {
    id: "2",
    assetName: "HP LaserJet Pro",
    assetCode: "PR-00056",
    assetLocation: "พื้นที่ใช้งานร่วม ชั้น 2",
    serialNumber: "MXJ72H35P",
    assetType: "printer",
    userId: "user123",
    manufacturer: "HP",
    model: "LaserJet Pro",
  },
  {
    id: "3",
    assetName: "Lenovo ThinkPad X1",
    assetCode: "PC-00345",
    assetLocation: "ฝ่ายวิจัยและพัฒนา ชั้น 4",
    serialNumber: "PQR4567",
    assetType: "computer",
    userId: "user456",
    manufacturer: "Lenovo",
    model: "ThinkPad X1",
  },
];


const Dashboard = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [userAssets, setUserAssets] = useState<UserAsset[]>([]);
  const [editingAsset, setEditingAsset] = useState<UserAsset | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const itemsPerPage = 10;

  const {
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
  } = useRepairRequests();

  useEffect(() => {
    if (user) {
      const filteredAssets = mockUserAssets.filter(
        (asset) => asset.userId === user.id
      );
      setUserAssets(filteredAssets);
    }
  }, [user]);

  useEffect(() => {
    console.log("repairRequests page dashboard", repairRequests);
  }, [repairRequests]);

  const handleDeleteAsset = (assetId: string) => {
    setUserAssets((prev) => prev.filter((asset) => asset.id !== assetId));
    toast.success(
      language === "th"
        ? "ลบทรัพย์สินเรียบร้อยแล้ว"
        : "Asset deleted successfully"
    );
  };

  const handleEditAsset = (asset: UserAsset) => {
    setEditingAsset(asset);
    setShowAssetModal(true);
  };

  const handleAssetSuccess = (newAsset?: UserAsset) => {
    if (newAsset) {
      if (editingAsset) {
        setUserAssets((prev) =>
          prev.map((a) => (a.id === editingAsset.id ? newAsset : a))
        );
      } else {
        const userId = user?.id ? String(user.id) : "unknown";
        setUserAssets((prev) => [
          ...prev,
          { ...newAsset, id: Date.now().toString(), userId },
        ]);
      }
    }
    setShowAssetModal(false);
    setEditingAsset(null);
  };

  const getAssetTypeIcon = (type: string) => {
    switch (type) {
      case "computer":
        return <Laptop className="h-4 w-4 text-blue-500" />;
      case "printer":
        return <Printer className="h-4 w-4 text-green-500" />;
      case "server":
        return <Server className="h-4 w-4 text-purple-500" />;
      default:
        return <Package className="h-4 w-4 text-gray-500" />;
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = repairRequests.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(repairRequests.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleApproveRequest = async (comments: string) => {
    if (!selectedRequest) return false;

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSelectedRequest({
        ...selectedRequest,
        approval: {
          status: "approved",
          approvalDate: new Date().toISOString(),
          approvedBy: user?.name || "Supervisor",
          approverRole: user?.role || "supervisor",
          comments,
        },
      });

      refetch();
      return true;
    } catch (error) {
      console.error("Error approving request:", error);
      return false;
    }
  };

  const handleRejectRequest = async (comments: string) => {
    if (!selectedRequest) return false;

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSelectedRequest({
        ...selectedRequest,
        approval: {
          status: "rejected",
          approvalDate: new Date().toISOString(),
          approvedBy: user?.name || "Supervisor",
          approverRole: user?.role || "supervisor",
          comments,
        },
      });

      refetch();
      return true;
    } catch (error) {
      console.error("Error rejecting request:", error);
      return false;
    }
  };

  // ฟังก์ชันแปลงวันที่เป็นแบบไทย
  function formatThaiDate(dateString: string) {

    console.log("formatThaiDate called with:", dateString);

    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear() + 543; // แปลงเป็น พ.ศ.
    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");
    const second = date.getSeconds().toString().padStart(2, "0");
    return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
  }

  //filter แสดง.ใน dashboard statuscared
  const filteredRequests = repairRequests.filter(
  (r) =>
    r.creator?.userId === user?.id ||
    r.creator?.fullName === user?.name
);

  const calculateStats = (requests) => {
  const normalize = (val) => (val || '').toUpperCase().replace(/\s/g, '_');
  const today = new Date().toISOString().split('T')[0];

  return {
    activeRepairs: requests.filter(r => ['IN_PROGRESS', 'PENDING'].includes(normalize(r.status))).length,
    completedToday: requests.filter(r => normalize(r.status) === 'COMPLETED' && r.updated_at && new Date(r.updated_at).toISOString().split('T')[0] === today).length,
    pending: requests.filter(r => normalize(r.status) === 'PENDING').length,
    urgent: requests.filter(r => normalize(r.importance) === 'HIGH').length,
  };
};

const userStats = calculateStats(filteredRequests);

  //role  for admin
  if (user?.role === "admin") {
    return (
      <DashboardLayout title={t("dashboard.title")}>
        <DashboardStatsCards stats={stats} isLoading={isStatsLoading} />

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold">
              {t("dashboard.repairRequests")}
            </h2>
            <Button
              onClick={() => setShowAddModal(true)}
              className="flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" />
              {t("dashboard.addRepairRequest")}
            </Button>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("dashboard.requestId")}</TableHead>
                  <TableHead className="w-44 min-w[140px] whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {t("dashboard.date")}
                    </div>
                  </TableHead>
                  <TableHead className="w-44 min-w[140px] whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {t("dashboard.reporter")}
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      <Building className="h-4 w-4 mr-1" />
                      {t("dashboard.location")}
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      <Package className="h-4 w-4 mr-1" />
                      {t("dashboard.asset")}
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {t("dashboard.assetLocation")}
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      <Info className="h-4 w-4 mr-1" />
                      {t("dashboard.details")}
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {t("dashboard.checkInOut")}
                    </div>
                  </TableHead>
                  <TableHead>{t("dashboard.status")}</TableHead>
                  <TableHead>{t("dashboard.priority")}</TableHead>
                  <TableHead>{t("dashboard.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {repairRequests.map((request) => (
                  <TableRow key={request.id}>
                    {/* รหัสคำขอ */}
                    <TableCell className="font-medium">
                      {request.id}
                    </TableCell>
                    {/* วันที่แจ้ง */}
                    <TableCell>
                      {request.create_at  
                        ? formatThaiDate(request.create_at)
                        : "N/A"}
                    </TableCell>
                  
                    {/* ผู้แจ้ง */}
                    <TableCell>
                      {request.reporterFullName ||
                        request.reporter ||
                        request.creator?.fullName ||
                        "N/A"}
                    </TableCell>
                    {/* สถานที่ */}
                    <TableCell>
                      {request.department
                        ? `${
                            typeof request.department === "object"
                              ? request.department.departmentName
                              : request.department
                          } / ${request.building || "-"} / ${
                            request.floor || "-"
                          }`
                        : "N/A"}
                    </TableCell>
                    {/* ทรัพย์สิน */}
                    <TableCell>
                      {request.assetName || request.asset?.assetName || "N/A"}
                      {(request.assetCode || request.asset?.assetCode) && (
                        <div className="text-xs text-gray-400">
                          {request.assetCode || request.asset?.assetCode}
                        </div>
                      )}
                    </TableCell>
                    {/* สถานที่ทรัพย์สิน */}
                    <TableCell>
                      {request.assetLocation ||
                        request.asset?.assetLocation ||
                        "N/A"}
                    </TableCell>
                    {/* รายละเอียด */}
                    <TableCell className="max-w-xs truncate">
                      {request.problemDetails || request.detail || "N/A"}
                    </TableCell>

                    {/* เช็คอิน/เช็คเอาท์ */}
                    <TableCell>
                      {request.checkInDate ? request.checkInDate : "-"} /
                      {request.checkOutDate ? request.checkOutDate : "-"}
                    </TableCell>
                    {/* สถานะ */}
                    <TableCell>
                      <RepairStatusBadge status={request.status} />
                    </TableCell>
                    {/* ความสำคัญ */}
                    <TableCell>
                      <PriorityBadge priority={request.priority} />
                    </TableCell>
                    {/* การดำเนินการ */}
                    <TableCell>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditRequest(request)}
                          className="text-blue-600 hover:text-blue-800"
                          title={t("common.edit")}
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDeleteRequest(request.id)}
                          title={t("common.delete")}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                        {request.status !== "Completed" && (
                          <button
                            onClick={() =>
                              handleUpdateStatus(request.id, "Completed")
                            }
                            className="text-green-600 hover:text-green-800"
                            title={t("common.markAsCompleted")}
                          >
                            <CheckCircle className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {showAddModal && (
          <AddRepairRequestModal
            onClose={() => setShowAddModal(false)}
            onSuccess={() => {
              setShowAddModal(false);
              refetch();
            }}
          />
        )}

        {showEditModal && selectedRequest && (
          <EditRepairForm
            repairRequest={selectedRequest}
            onClose={() => {
              setShowEditModal(false);
              setSelectedRequest(null);
            }}
            onSuccess={() => {
              setShowEditModal(false);
              setSelectedRequest(null);
              refetch();
            }}
          />
        )}
      </DashboardLayout>
    );
  }

  // role for technician
  if (user?.role === "technician") {
    return (
      <DashboardLayout
        title={
          language === "th" ? "แดชบอร์ดช่างเทคนิค" : "Technician Dashboard"
        }
      >
        <DashboardStatsCards stats={stats} isLoading={isStatsLoading} />

        <Card className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-4 border-b bg-blue-50">
            <h2 className="text-lg font-semibold text-blue-800">
              {language === "th" ? "งานที่ได้รับมอบหมาย" : "My Work Orders"}
            </h2>
          </div>

          {isLoading ? (
            <div className="p-8 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === "th" ? "งาน" : t("dashboard.task")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === "th" ? "ผู้แจ้ง" : "Reporter"}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === "th" ? "แผนก" : "Department"}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === "th" ? "วันที่แจ้ง" : "Date Reported"}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === "th" ? "สถานะ" : t("dashboard.status")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === "th"
                        ? "ความสำคัญ"
                        : t("dashboard.priority")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === "th" ? "การอนุมัติ" : "Approval"}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === "th"
                        ? "การดำเนินการ"
                        : t("dashboard.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {repairRequests.length > 0 ? (
                    repairRequests.map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {request.id}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                          {request.problemDetails || request.detail || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {request.reporterFullName ||
                            request.reporter ||
                            request.creator?.fullName ||
                            "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {request.department ||
                            request.creator?.department?.department_name ||
                            "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {request.dateReported}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <RepairStatusBadge status={request.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <PriorityBadge priority={request.priority} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {request.approval ? (
                            <div className="flex items-center">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  request.approval.status === "approved"
                                    ? "bg-green-100 text-green-800"
                                    : request.approval.status === "rejected"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {request.approval.status === "approved"
                                  ? language === "th"
                                    ? "อนุมัติแล้ว"
                                    : "Approved"
                                  : request.approval.status === "rejected"
                                  ? language === "th"
                                    ? "ปฏิเสธแล้ว"
                                    : "Rejected"
                                  : language === "th"
                                  ? "รอการอนุมัติ"
                                  : "Pending"}
                              </span>
                              {request.approval.approvedBy && (
                                <span className="ml-2 text-xs text-gray-500">
                                  {request.approval.approvedBy}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {language === "th"
                                ? "ยังไม่มีการอนุมัติ"
                                : "No approval"}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewDetails(request)}
                              className="text-blue-600 hover:text-blue-800 transition-colors hover:scale-110"
                              title={
                                language === "th"
                                  ? "ดูรายละเอียด"
                                  : "View Details"
                              }
                            >
                              <Eye className="h-5 w-5" />
                            </button>

                            {request.status !== "Completed" &&
                              !request.approval?.status && (
                                <button
                                  onClick={() => {
                                    setSelectedRequest(request);
                                    setShowApprovalModal(true);
                                  }}
                                  className="text-yellow-600 hover:text-yellow-800 transition-colors hover:scale-110"
                                  title={
                                    language === "th"
                                      ? "อนุมัติ/ปฏิเสธ"
                                      : "Approve/Reject"
                                  }
                                >
                                  <FileText className="h-5 w-5" />
                                </button>
                              )}

                            {request.status !== "Completed" && (
                              <button
                                onClick={() =>
                                  handleUpdateStatus(request.id, "Completed")
                                }
                                className="text-green-600 hover:text-green-800 transition-colors hover:scale-110"
                                title={
                                  language === "th"
                                    ? "ทำเครื่องหมายว่าเสร็จสิ้น"
                                    : "Mark as Completed"
                                }
                              >
                                <CheckCircle className="h-5 w-5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={9}
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        {language === "th"
                          ? "ไม่มีงานที่ได้รับมอบหมาย"
                          : t("dashboard.noWorkOrders")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* All Reported Repairs Section */}
        <Card className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-4 border-b bg-green-50">
            <h2 className="text-lg font-semibold text-green-800">
              {language === "th"
                ? "รายการแจ้งซ่อมทั้งหมด"
                : "All Reported Repairs"}
            </h2>
          </div>

          {isLoading ? (
            <div className="p-8 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === "th" ? "รายละเอียด" : "Details"}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === "th" ? "ผู้แจ้ง" : "Reporter"}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === "th"
                        ? "ช่างที่รับผิดชอบ"
                        : "Assigned Technician"}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === "th" ? "วันที่แจ้ง" : "Date Reported"}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === "th" ? "สถานะ" : "Status"}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === "th" ? "การดำเนินการ" : "Actions"}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {repairRequests.length > 0 ? (
                    repairRequests.map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {request.id}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                          {request.problemDetails || request.detail || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {request.reporterFullName ||
                            request.reporter ||
                            request.creator?.fullName ||
                            "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className="font-medium text-blue-600">
                            {request.technician || "ไม่ได้กำหนด"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {request.dateReported}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <RepairStatusBadge status={request.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button
                            onClick={() => handleViewDetails(request)}
                            className="text-blue-600 hover:text-blue-800 transition-colors hover:scale-110"
                            title={
                              language === "th"
                                ? "ดูรายละเอียด"
                                : "View Details"
                            }
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        {language === "th"
                          ? "ไม่มีรายการแจ้งซ่อม"
                          : "No repair requests"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {showDetailsModal && selectedRequest && (
          <RepairDetailsModal
            repair={selectedRequest}
            onClose={() => {
              setShowDetailsModal(false);
              setSelectedRequest(null);
            }}
            onActionComplete={() => {
              refetch();
            }}
          />
        )}

        {showApprovalModal && selectedRequest && (
          <SupervisorApprovalModal
            repair={selectedRequest}
            onClose={() => {
              setShowApprovalModal(false);
              setSelectedRequest(null);
            }}
            onApprove={handleApproveRequest}
            onReject={handleRejectRequest}
          />
        )}
      </DashboardLayout>
    );
  }

  // role for user
  return (
    <DashboardLayout title={t("dashboard.title")}>
      <DashboardStatsCards stats={userStats} isLoading={isStatsLoading} />

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">
            {language === "th" ? "รายการแจ้งซ่อมของฉัน" : "My Repair Requests"}
          </h2>
          <Button
            onClick={() => setShowAddModal(true)}
            className="flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" />
            {language === "th" ? "แจ้งซ่อมใหม่" : "New Repair Request"}
          </Button>
        </div>

        {isLoading ? (
          <div className="p-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : repairRequests.filter(
            (r) =>
              r.creator?.userId === user?.id ||
              r.creator?.fullName === user?.name
          ).length === 0 ? (
          <EmptyRepairState onAddRepair={() => setShowAddModal(true)} />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-white text-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-lg font-extrabold uppercase tracking-widest rounded-tl-lg shadow-sm">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-lg font-extrabold uppercase tracking-widest shadow-sm">
                    {language === "th" ? "วันที่" : "Date"}
                  </th>
                  <th className="px-6 py-4 text-left text-lg font-extrabold uppercase tracking-widest shadow-sm">
                    {language === "th" ? "รายละเอียด" : "Details"}
                  </th>
                  <th className="px-6 py-4 text-left text-lg font-extrabold uppercase tracking-widest shadow-sm">
                    {language === "th" ? "สินทรัพย์" : "Asset"}
                  </th>
                  <th className="px-6 py-4 text-left text-lg font-extrabold uppercase tracking-widest shadow-sm">
                    {language === "th" ? "ที่อยู่สินทรัพย์" : "AssetLocation"}
                  </th>
                  <th className="px-6 py-4 text-left text-lg font-extrabold uppercase tracking-widest shadow-sm">
                    {language === "th" ? "ช่างเทคนิค" : "Technician"}
                  </th>

                  <th className="px-6 py-4 text-left text-lg font-extrabold uppercase tracking-widest shadow-sm">
                    {language === "th" ? "สถานะ" : "Status"}
                  </th>
                  <th className="px-6 py-4 text-left text-lg font-extrabold uppercase tracking-widest shadow-sm">
                    {language === "th" ? "การอนุมัติ" : "Approval"}
                  </th>
                  <th className="px-6 py-4 text-left text-lg font-extrabold uppercase tracking-widest rounded-tr-lg shadow-sm">
                    {language === "th" ? "ดำเนินการ" : "Actions"}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {repairRequests

                  .filter(
                    (r) =>
                      r.creator?.userId === user?.id ||
                      r.creator?.fullName === user?.name
                  )
                  .map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      {/* id */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {request.id}
                      </td>
                      {/* date reported */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {request.dateReported}
                      </td>
                      {/* details */}
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {request.problemDetails || request.detail || "N/A"}
                      </td>
                      {/* asset */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {request.assetName || request.asset?.assetName || "N/A"}
                      </td>
                      {/* asset location */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {request.assetLocation ||
                          request.asset?.assetLocation ||
                          "N/A"}
                      </td>
                      {/* technician */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="font-medium text-blue-600">
                          {request.inspector?.role === "TECHNICIAN"
                            ? request.inspector.fullName
                            : "ไม่ได้กำหนด"}
                        </span>
                      </td>

                      {/* status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <RepairStatusBadge status={request.status} />
                      </td>
                      {/* approval */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {request.approval ? (
                          <div className="flex items-center">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                request.approval.status === "approved"
                                  ? "bg-green-100 text-green-800"
                                  : request.approval.status === "rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {request.approval.status === "approved"
                                ? language === "th"
                                  ? "อนุมัติแล้ว"
                                  : "Approved"
                                : request.approval.status === "rejected"
                                ? language === "th"
                                  ? "ปฏิเสธแล้ว"
                                  : "Rejected"
                                : language === "th"
                                ? "รอการอนุมัติ"
                                : "Pending"}
                            </span>
                            {request.approval.approvedBy && (
                              <span className="ml-2 text-xs text-gray-500">
                                {request.approval.approvedBy}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {language === "th"
                              ? "ยังไม่มีการอนุมัติ"
                              : "No approval"}
                          </span>
                        )}
                      </td>
                      {/* actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          {/* ปุ่มดูรายละเอียด */}
                          <button
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowDetailsModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 transition-colors hover:scale-110"
                            title={
                              language === "th"
                                ? "ดูรายละเอียด"
                                : "View Details"
                            }
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                          {/* ปุ่มแก้ไข */}
                          {request.status !== "Completed" &&
                            request.status !== "Cancelled" && (
                              <button
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setShowEditModal(true);
                                }}
                                className="text-yellow-600 hover:text-yellow-800 transition-colors hover:scale-110"
                                title={language === "th" ? "แก้ไข" : "Edit"}
                              >
                                <Edit className="h-5 w-5" />
                              </button>
                            )}
                          {/* ปุ่มยกเลิก */}
                          {request.status !== "Completed" &&
                            request.status !== "Cancelled" && (
                              <button
                                onClick={() => handleDeleteRequest(request.id)}
                                className="text-red-600 hover:text-red-800 transition-colors hover:scale-110"
                                title={
                                  language === "th" ? "ยกเลิกรายการ" : "Cancel"
                                }
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            )}
                        </div>
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button 
                          onClick={() => handleViewDetails(request)} 
                          className="text-blue-600 hover:text-blue-800 transition-colors hover:scale-110" 
                          title={language === 'th' ? 'ดูรายละเอียด' : 'View Details'}
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                      </td> */}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* แสดง model การแจ้งซ่อมใหม่ */}
      {showAddModal && (
        <AddRepairRequestModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            refetch();
          }}
        />
      )}

      {/* แสดง model การเพิ่มสินทรัพย์ ไม่ได้ใช้แล้ว */}
      {showAssetModal && (
        <AssetManagementModal
          onClose={() => {
            setShowAssetModal(false);
            setEditingAsset(null);
          }}
          onSuccess={handleAssetSuccess}
          initialAsset={editingAsset}
        />
      )}

      {showDetailsModal && selectedRequest && (
        <RepairDetailsModal
          repair={selectedRequest}
          readOnly={true}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedRequest(null);
          }}
          onActionComplete={() => {
            refetch();
          }}
        />
      )}

      {showEditModal && selectedRequest && (
        <EditRepairForm
          repairRequest={selectedRequest}
          onClose={() => {
            setShowEditModal(false);
            setSelectedRequest(null);
          }}
          onSuccess={() => {
            setShowEditModal(false);
            setSelectedRequest(null);
            refetch();
          }}
        />
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
