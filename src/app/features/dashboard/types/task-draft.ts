import { Task } from '../models/task';

export type TaskDraft = Omit<
  Task,
  'id' | 'isOverdue' | 'createdAt' | 'updatedAt' | 'completedAt' | 'order'
>;
