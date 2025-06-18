
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Check, Clock, AlertCircle, Calendar, CheckCircle, Wrench, FileText, UserCheck, Upload, FileCheck } from 'lucide-react';
import apiClient from '@/services/api';
import { RepairApproval, RepairDocument, RepairRequest } from '@/types';
import Swal from 'sweetalert2';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import RepairDetailsModal from '@/components/RepairDetailsModal';
import SupervisorApprovalModal from '@/components/SupervisorApprovalModal';
import TechnicianSelfApprovalModal from '@/components/TechnicianSelfApprovalModal';
import { toast } from 'sonner';
import CompletedStatusIndicator from '@/components/CompletedStatusIndicator';

const Tasks = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [tasks, setTasks] = useState<RepairRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 10;
  const [selectedTask, setSelectedTask] = useState<RepairRequest | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showSelfApprovalModal, setShowSelfApprovalModal] = useState(false);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      // Updated to fetch more realistic demo data
      const requests = await apiClient.getRepairRequests();
      
      // Generate more demo data
      const enhancedRequests: RepairRequest[] = [];
      
      // Generate 25 repair requests for better pagination testing
      for (let i = 0; i < 25; i++) {
        const baseRequest = requests[i % requests.length];
        if (!baseRequest) continue;
        
        // Random completion date for completed tasks
        const randomCompletionDate = new Date();
        randomCompletionDate.setDate(randomCompletionDate.getDate() - Math.floor(Math.random() * 10));
        
        // Random approval status
        let approval: RepairApproval | undefined;
        const approvalRandom = Math.random();
        if (approvalRandom > 0.7) {
          approval = {
            status: 'approved',
            approvalDate: '2025-03-30',
            approvedBy: 'หัวหน้าช่างเทคนิค',
            approverRole: 'Head Technician',
            comments: 'อนุมัติให้ดำเนินการได้'
          };
        } else if (approvalRandom > 0.5) {
          approval = {
            status: 'rejected',
            approvalDate: '2025-03-29',
            approvedBy: 'หัวหน้าช่างเทคนิค',
            approverRole: 'Head Technician',
            comments: 'ไม่อนุมัติ เนื่องจากงบประมาณไม่เพียงพอ'
          };
        } else if (approvalRandom > 0.3) {
          approval = {
            status: 'pending',
          };
        }

        // Random documents
        const documents: RepairDocument[] = [];
        if (Math.random() > 0.5) {
          documents.push({
            id: `doc-${i}-1`,
            fileName: 'repair-photo.jpg',
            fileType: 'image',
            fileUrl: '/placeholder.svg',
            uploadDate: '2025-03-29',
            uploadedBy: 'ช่างเอก'
          });
        }
        if (Math.random() > 0.7) {
          documents.push({
            id: `doc-${i}-2`,
            fileName: 'repair-report.pdf',
            fileType: 'document',
            fileUrl: '/placeholder.svg',
            uploadDate: '2025-03-28',
            uploadedBy: 'ช่างเอก'
          });
        }
        
        // Add more varied technicians, statuses and priority
        const enhancedRequest: RepairRequest = {
          ...baseRequest,
          id: `${baseRequest.id}-${i+1}`,
          technician: ['ช่างเอก', 'ช่างฉัตร', 'ช่างบุญมี'][Math.floor(Math.random() * 3)],
          status: Math.random() > 0.6 ? 'เสร็จสิ้น' : (Math.random() > 0.4 ? 'กำลังดำเนินการ' : 'รอดำเนินการ'),
          priority: Math.random() > 0.6 ? 'High' : (Math.random() > 0.5 ? 'Medium' : 'Low') as 'High' | 'Medium' | 'Low',
          checkOutDate: Math.random() > 0.6 ? randomCompletionDate.toISOString().split('T')[0] : undefined,
          approval,
          documents: documents.length > 0 ? documents : undefined
        };
        
        enhancedRequests.push(enhancedRequest);
      }
      
      setTasks(enhancedRequests);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load tasks'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      // For completed tasks, show a detailed confirmation
      if (newStatus.toLowerCase() === 'เสร็จสิ้น' || newStatus.toLowerCase() === 'completed') {
        const result = await Swal.fire({
          title: language === 'th' ? 'ยืนยันการเสร็จสิ้นงาน' : 'Confirm Completion',
          html: language === 'th' 
            ? 'กรุณายืนยันว่างานซ่อมเสร็จสิ้นแล้ว<br>การยืนยันนี้จะบันทึกเวลาเสร็จงานปัจจุบัน' 
            : 'Please confirm this repair is complete<br>This will record the current time as completion time',
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: language === 'th' ? 'ยืนยัน เสร็จสิ้นแล้ว' : 'Yes, it\'s complete',
          cancelButtonText: language === 'th' ? 'ยกเลิก' : 'Cancel'
        });
        
        if (!result.isConfirmed) {
          return;
        }
      }
      
      await apiClient.updateRepairRequest(id, { 
        status: newStatus,
      });
      
      // Update the local state for immediate UI update
      setTasks(prevTasks => prevTasks.map(task => {
        if (task.id === id) {
          return {
            ...task,
            status: newStatus,
            checkOutDate: (newStatus.toLowerCase() === 'เสร็จสิ้น' || newStatus.toLowerCase() === 'completed') 
              ? new Date().toISOString().split('T')[0] 
              : task.checkOutDate
          };
        }
        return task;
      }));
      
      // For completed status, show a clearer success message
      if (newStatus.toLowerCase() === 'เสร็จสิ้น' || newStatus.toLowerCase() === 'completed') {
        Swal.fire({
          icon: 'success',
          title: language === 'th' ? 'บันทึกการเสร็จสิ้นแล้ว' : 'Completion Recorded',
          text: language === 'th' 
            ? 'บันทึกเวลาเสร็จงานเรียบร้อยแล้ว' 
            : 'Completion time has been successfully recorded',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        Swal.fire({
          icon: 'success',
          title: language === 'th' ? 'อัปเดตแล้ว' : 'Updated',
          text: language === 'th' 
            ? 'อัปเดตสถานะเรียบร้อยแล้ว' 
            : 'Task status updated successfully',
          timer: 1500,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error('Error updating task status:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update task status'
      });
    }
  };

  const handleViewDetails = (task: RepairRequest) => {
    setSelectedTask(task);
    setShowDetailsModal(true);
  };

  const handleOpenApproval = (task: RepairRequest) => {
    setSelectedTask(task);
    setShowApprovalModal(true);
  };

  const handleOpenSelfApproval = (task: RepairRequest) => {
    setSelectedTask(task);
    setShowSelfApprovalModal(true);
  };

  const handleApprove = async (comments: string) => {
    if (!selectedTask) return;
    
    try {
      // In a real app, this would update the server data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state for demo
      setTasks(prevTasks => 
        prevTasks.map(task => {
          if (task.id === selectedTask.id) {
            return {
              ...task,
              approval: {
                status: 'approved',
                approvalDate: new Date().toISOString().split('T')[0],
                approvedBy: 'หัวหน้าช่างเทคนิค',
                approverRole: 'Head Technician',
                comments
              }
            };
          }
          return task;
        })
      );
      
      setShowApprovalModal(false);
      setSelectedTask(null);
    } catch (error) {
      toast.error(
        language === 'th'
          ? 'เกิดข้อผิดพลาดในการอนุมัติ'
          : 'Error approving request'
      );
    }
  };

  const handleSelfApprove = async (comments: string, references: any[]) => {
    if (!selectedTask) return false;
    
    try {
      // In a real app, this would update the server data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state for demo
      setTasks(prevTasks => 
        prevTasks.map(task => {
          if (task.id === selectedTask.id) {
            return {
              ...task,
              approval: {
                status: 'approved',
                approvalDate: new Date().toISOString().split('T')[0],
                approvedBy: 'ช่างเทคนิค (อนุมัติตนเอง)',
                approverRole: 'Technician',
                comments,
              },
              documents: [
                ...(task.documents || []),
                ...references.map(ref => ({
                  id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                  fileName: ref.fileName,
                  fileType: ref.fileType === 'image' ? 'image' : 'document' as 'image' | 'document',
                  fileUrl: ref.fileUrl,
                  uploadDate: new Date().toISOString().split('T')[0],
                  uploadedBy: user?.name || 'ช่างเทคนิค'
                }))
              ]
            };
          }
          return task;
        })
      );
      
      setShowSelfApprovalModal(false);
      setSelectedTask(null);
      return true;
    } catch (error) {
      toast.error(
        language === 'th'
          ? 'เกิดข้อผิดพลาดในการอนุมัติตนเอง'
          : 'Error in self-approval'
      );
      return false;
    }
  };

  const handleReject = async (comments: string) => {
    if (!selectedTask) return;
    
    try {
      // In a real app, this would update the server data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state for demo
      setTasks(prevTasks => 
        prevTasks.map(task => {
          if (task.id === selectedTask.id) {
            return {
              ...task,
              approval: {
                status: 'rejected',
                approvalDate: new Date().toISOString().split('T')[0],
                approvedBy: 'หัวหน้าช่างเทคนิค',
                approverRole: 'Head Technician',
                comments
              }
            };
          }
          return task;
        })
      );
      
      setShowApprovalModal(false);
      setSelectedTask(null);
    } catch (error) {
      toast.error(
        language === 'th'
          ? 'เกิดข้อผิดพลาดในการปฏิเสธ'
          : 'Error rejecting request'
      );
    }
  };
  
  const handleDocumentUpload = () => {
    if (!selectedTask) return;
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,.pdf,.doc,.docx';
    input.onchange = async (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        const file = target.files[0];
        
        try {
          // Simulate file upload
          toast.loading(language === 'th' ? 'กำลังอัปโหลดไฟล์...' : 'Uploading file...');
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Update local state for demo
          const newDocument: RepairDocument = {
            id: Date.now().toString(),
            fileName: file.name,
            fileType: file.type.startsWith('image/') ? 'image' : 'document',
            fileUrl: URL.createObjectURL(file),
            uploadDate: new Date().toISOString().split('T')[0],
            uploadedBy: user?.name || 'Current User'
          };
          
          setTasks(prevTasks => 
            prevTasks.map(task => {
              if (task.id === selectedTask.id) {
                return {
                  ...task,
                  documents: task.documents ? [...task.documents, newDocument] : [newDocument]
                };
              }
              return task;
            })
          );
          
          toast.dismiss();
          toast.success(
            language === 'th' 
              ? `อัปโหลดไฟล์ ${file.name} สำเร็จ` 
              : `File ${file.name} uploaded successfully`
          );
        } catch (error) {
          toast.error(
            language === 'th'
              ? 'เกิดข้อผิดพลาดในการอัปโหลดไฟล์'
              : 'Error uploading file'
          );
        }
      }
    };
    input.click();
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'pending') return task.status === 'รอดำเนินการ' || task.status === 'pending';
    if (filter === 'in-progress') return task.status === 'กำลังดำเนินการ' || task.status === 'in progress';
    if (filter === 'completed') return task.status === 'เสร็จสิ้น' || task.status.toLowerCase() === 'completed';
    return true;
  });

  // Pagination logic
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  return (
    <DashboardLayout title="My Tasks">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div 
          className={`bg-white p-6 rounded-lg shadow cursor-pointer ${filter === 'all' ? 'ring-2 ring-blue-500' : ''}`}
          onClick={() => setFilter('all')}
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Wrench className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{language === 'th' ? 'งานทั้งหมด' : 'All Tasks'}</p>
              <p className="text-2xl font-semibold">{tasks.length}</p>
            </div>
          </div>
        </div>
        
        <div 
          className={`bg-white p-6 rounded-lg shadow cursor-pointer ${filter === 'pending' ? 'ring-2 ring-blue-500' : ''}`}
          onClick={() => setFilter('pending')}
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              <Clock className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{language === 'th' ? 'รอดำเนินการ' : 'Pending'}</p>
              <p className="text-2xl font-semibold">
                {tasks.filter(t => t.status === 'รอดำเนินการ' || t.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
        
        <div 
          className={`bg-white p-6 rounded-lg shadow cursor-pointer ${filter === 'in-progress' ? 'ring-2 ring-blue-500' : ''}`}
          onClick={() => setFilter('in-progress')}
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <AlertCircle className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{language === 'th' ? 'กำลังดำเนินการ' : 'In Progress'}</p>
              <p className="text-2xl font-semibold">
                {tasks.filter(t => t.status === 'กำลังดำเนินการ' || t.status === 'in progress').length}
              </p>
            </div>
          </div>
        </div>
        
        <div 
          className={`bg-white p-6 rounded-lg shadow cursor-pointer ${filter === 'completed' ? 'ring-2 ring-blue-500' : ''}`}
          onClick={() => setFilter('completed')}
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <Check className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{language === 'th' ? 'เสร็จสิ้น' : 'Completed'}</p>
              <p className="text-2xl font-semibold">
                {tasks.filter(t => t.status === 'เสร็จสิ้น' || t.status.toLowerCase() === 'completed').length}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">{language === 'th' ? 'งานของฉัน' : 'My Tasks'}</h2>
        </div>
        
        {loading ? (
          <div className="p-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : currentTasks.length > 0 ? (
          <>
            <div className="divide-y divide-gray-200">
              {currentTasks.map((task) => (
                <div key={task.id} className="p-4 hover:bg-gray-50">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center flex-wrap gap-2">
                        <span className="text-sm font-medium text-gray-900">{task.id}</span>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          task.priority === 'High' ? 'bg-red-100 text-red-800' : 
                          task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-green-100 text-green-800'
                        }`}>
                          {language === 'th' 
                            ? task.priority === 'High' ? 'สูง' : task.priority === 'Medium' ? 'ปานกลาง' : 'ต่ำ'
                            : task.priority
                          }
                        </span>
                        
                        {/* Enhanced completed status indicator */}
                        <CompletedStatusIndicator 
                          status={task.status} 
                          completionDate={task.checkOutDate}
                          className="text-xs"
                        />
                        
                        {/* Approval status indicator */}
                        {task.approval && (
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            task.approval.status === 'approved' ? 'bg-green-100 text-green-800' : 
                            task.approval.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {language === 'th' 
                              ? task.approval.status === 'approved' ? 'อนุมัติแล้ว' : 
                                task.approval.status === 'rejected' ? 'ไม่อนุมัติ' : 'รออนุมัติ'
                              : task.approval.status === 'approved' ? 'Approved' :
                                task.approval.status === 'rejected' ? 'Rejected' : 'Pending Approval'
                            }
                            {task.approval.approvedBy && (
                              <span className="ml-1 opacity-75">
                                ({task.approval.approvedBy})
                              </span>
                            )}
                          </span>
                        )}
                        
                        {/* Document indicator */}
                        {task.documents && task.documents.length > 0 && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            <FileText className="h-3 w-3 mr-1" />
                            {task.documents.length}
                          </span>
                        )}
                      </div>
                      <h3 className="mt-1 text-base font-medium">{task.problemDetails || task.detail}</h3>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {task.dateReported || task.create_at}
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        <span className="font-medium">{language === 'th' ? 'ผู้แจ้ง:' : 'Reported by:'}</span> {task.reporter || task.reporterFullName || task.creator?.fullName}
                      </div>
                      <div className="mt-1 text-sm text-blue-600">
                        <span className="font-medium">{language === 'th' ? 'ช่างผู้รับผิดชอบ:' : 'Technician:'}</span> {task.technician || 'ไม่มีผู้รับผิดชอบ'}
                      </div>
                    </div>
                    
                    <div className="mt-3 sm:mt-0 space-x-2 flex flex-wrap gap-2">
                      <button
                        onClick={() => handleViewDetails(task)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        {language === 'th' ? 'ดูรายละเอียด' : 'View Details'}
                      </button>
                      
                      {(task.status === 'รอดำเนินการ' || task.status === 'pending') && (
                        <button
                          onClick={() => handleStatusChange(task.id, 'กำลังดำเนินการ')}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                        >
                          <Clock className="h-4 w-4 mr-1" />
                          {language === 'th' ? 'เริ่มงาน' : 'Start Work'}
                        </button>
                      )}
                      
                      {(task.status === 'กำลังดำเนินการ' || task.status === 'in progress') && (
                        <button
                          onClick={() => handleStatusChange(task.id, 'เสร็จสิ้น')}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          {language === 'th' ? 'เสร็จสิ้น' : 'Complete'}
                        </button>
                      )}
                      
                      {/* Self-approval button for technicians - new feature */}
                      {(task.status !== 'รอดำเนินการ' && task.status !== 'pending') && 
                       (!task.approval || task.approval.status === 'pending') && (
                        <button
                          onClick={() => handleOpenSelfApproval(task)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          <FileCheck className="h-4 w-4 mr-1" />
                          {language === 'th' ? 'อนุมัติตนเอง' : 'Self Approve'}
                        </button>
                      )}

                      {/* Supervisor approval button */}
                      <button
                        onClick={() => handleOpenApproval(task)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-purple-700 bg-purple-100 hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                      >
                        <UserCheck className="h-4 w-4 mr-1" />
                        {language === 'th' ? 'อนุมัติ' : 'Approve'}
                      </button>
                      
                      <button
                        onClick={() => {
                          setSelectedTask(task);
                          handleDocumentUpload();
                        }}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <Upload className="h-4 w-4 mr-1" />
                        {language === 'th' ? 'อัปโหลด' : 'Upload'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Enhanced Pagination with current page indicator */}
            {filteredTasks.length > tasksPerPage && (
              <div className="p-4 border-t">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm text-gray-500">
                    {language === 'th' 
                      ? `แสดง ${indexOfFirstTask + 1} ถึง ${Math.min(indexOfLastTask, filteredTasks.length)} จากทั้งหมด ${filteredTasks.length} รายการ` 
                      : `Showing ${indexOfFirstTask + 1} to ${Math.min(indexOfLastTask, filteredTasks.length)} of ${filteredTasks.length} entries`}
                  </div>
                </div>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                      let pageNum = i + 1;
                      
                      if (totalPages > 5) {
                        if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          if (i === 0) pageNum = 1;
                          else if (i === 1) pageNum = currentPage - 1;
                          else if (i === 2) pageNum = currentPage;
                          else if (i === 3) pageNum = currentPage + 1;
                          else pageNum = totalPages;
                        }
                      }
                      
                      return (
                        <PaginationItem key={i}>
                          <PaginationLink
                            onClick={() => setCurrentPage(pageNum)}
                            isActive={currentPage === pageNum}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        ) : (
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <Calendar className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500">
              {language === 'th' 
                ? 'ไม่พบงานที่ตรงกับตัวกรองที่เลือก' 
                : 'No tasks found matching the selected filter'
              }
            </p>
          </div>
        )}
      </div>
      
      {/* Repair Details Modal */}
      {showDetailsModal && selectedTask && (
        <RepairDetailsModal
          repair={selectedTask}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedTask(null);
          }}
          onActionComplete={() => {
            fetchTasks();
          }}
        />
      )}

      {/* Supervisor Approval Modal */}
      {showApprovalModal && selectedTask && (
        <SupervisorApprovalModal
          repair={selectedTask}
          onClose={() => {
            setShowApprovalModal(false);
            setSelectedTask(null);
          }}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}

      {/* Self-Approval Modal for Technicians - New feature */}
      {showSelfApprovalModal && selectedTask && (
        <TechnicianSelfApprovalModal
          repair={selectedTask}
          onClose={() => {
            setShowSelfApprovalModal(false);
            setSelectedTask(null);
          }}
          onApprove={handleSelfApprove}
        />
      )}
    </DashboardLayout>
  );
};

export default Tasks;
