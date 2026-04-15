
export type UserRole = 'Owner' | 'Developer';

export type ProjectStatus = 'To Do' | 'In Progress' | 'Completed' | 'Deferred' | 'Pending Approval';

export type Priority = 'Low' | 'Medium' | 'High';

export interface ProjectTask {
  id: string;
  title: string;
  description: string;
  estimatedCost: number;
  actualCost: number;
  estimatedHours: number;
  actualHours: number;
  status: ProjectStatus;
  priority: Priority;
  category: 'Feature' | 'Design' | 'Technical' | 'Marketing';
  assignedTo?: string;
  createdBy: UserRole;
}

export interface Notice {
  id: string;
  author: string;
  role: UserRole;
  content: string;
  timestamp: Date;
}

export interface ShoppingItem {
  id: string;
  title: string;
  description: string;
  cost: number;
  category: string;
  isChecked: boolean;
}
