
import { useState } from 'react';
import { useRoleBasedApi } from '@/hooks/useRoleBasedApi';
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, XCircle, Edit } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

// Sample task interface - update based on your actual API response
interface Task {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  assignedTo: string;
  createdAt: string;
  dueDate?: string;
}

const TechnicianTasks = () => {
  const { toast } = useToast();
  const api = useRoleBasedApi();

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ['technicianTasks'],
    queryFn: async () => {
      if (!api.tasks) {
        throw new Error('You do not have permission to view tasks');
      }
      return await api.tasks.getTasks();
    }
  });

  // Handle error separately
  if (error) {
    toast({
      title: 'Failed to load tasks',
      description: error instanceof Error ? error.message : 'Please try again later',
      variant: 'destructive',
    });
  }

  const tasks = data?.data || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Cancelled</Badge>;
      default:
        return <Badge className="bg-yellow-500">Pending</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="outline" className="border-red-500 text-red-500">High</Badge>;
      case 'medium':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-500">Medium</Badge>;
      default:
        return <Badge variant="outline" className="border-green-500 text-green-500">Low</Badge>;
    }
  };

  return (
    <DashboardLayout title="My Tasks">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Tasks</h1>
          <Button onClick={() => refetch()}>Refresh</Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : tasks.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.title}</TableCell>
                    <TableCell>{getStatusBadge(task.status)}</TableCell>
                    <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                    <TableCell>{task.dueDate || 'Not set'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="text-green-600 hover:bg-green-50">
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="text-red-600 hover:bg-red-50">
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No tasks assigned to you.</p>
            <Button variant="outline" className="mt-4" onClick={() => refetch()}>Refresh</Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TechnicianTasks;
