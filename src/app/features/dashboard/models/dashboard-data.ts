import { Assignee } from './assignee';
import { Task } from './task';
import { TaskFilters } from './task-filters';

export interface DashboardData {
  tasks: Task[];
  allTasks: Task[];
  loading: boolean;
  filters: TaskFilters;
  users: Assignee[];
}
