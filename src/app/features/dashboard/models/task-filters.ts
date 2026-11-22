import { TaskStatus } from '../types/task-status';
import { TasksPriority } from '../types/task-priority';

export interface TaskFilters {
  query: string;
  status: TaskStatus | 'all';
  priority: TasksPriority | 'all';
}
