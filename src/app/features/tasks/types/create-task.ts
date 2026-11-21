import { Task } from '../models/task';

export type CreateTask = Omit<
  Task,
  'id' | 'isOverdue' | 'createdAt' | 'updatedAt' | 'completedAt' | 'order'
>;
