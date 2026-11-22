import { TaskStatus } from '../types/task-status';
import { Task } from './task';

export interface TaskDropEvent {
  task: Task;
  status: TaskStatus;
  order: number;
}
