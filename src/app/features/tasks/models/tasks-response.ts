import { Task } from './task';

export interface TasksResponse {
  tasks: Task[];
  meta: {
    totalCount: number;
    lastUpdated: string;
  };
}
