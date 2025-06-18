
import { z } from 'zod';

// Add department options
export const departmentOptions = [
  'IT',
  'HR',
  'Finance',
  'Marketing',
  'Operations',
  'Engineering',
  'Customer Service',
  'Sales',
  'Research & Development',
  'Administration'
];

// Add department ID mapping
export const departmentIdMap: Record<string, string> = {
  'IT': '1',
  'HR': '2',
  'Finance': '3',
  'Marketing': '4',
  'Operations': '5',
  'Engineering': '6',
  'Customer Service': '7',
  'Sales': '8',
  'Research & Development': '9',
  'Administration': '10'
};

export const repairRequestSchema = z.object({
  reportDate: z.string().optional(),
  reporterName: z.string().optional(),
  department: z.string().optional(),
  building: z.string().optional(),
  floor: z.string().optional(),
  assetName: z.string().min(1, { message: "Asset name is required" }),
  assetCode: z.string().optional(),
  assetLocation: z.string().min(1, { message: "Asset location is required" }),
  serialNumber: z.string().optional(),
  problemDetails: z.string().min(2, { message: "Problem details must be at least 10 characters" }),
  priority: z.string().optional(),
  status: z.string().optional(),
  images: z.array(z.string()).optional().default([]), 
});

export type RepairRequestFormData = z.infer<typeof repairRequestSchema>;
