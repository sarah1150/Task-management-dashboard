import { Assignee } from './assignee';
import { TaskStatus } from '../types/task-status';
import { TasksPriority } from '../types/task-priority';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TasksPriority;
  dueDate: string;
  isOverdue: boolean;
  assignee: Assignee;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  order: number;
}
