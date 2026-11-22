export type TaskStatus = 'todo' | 'in_progress' | 'done';

export const TASK_STATUSES: readonly { value: TaskStatus; label: string }[] = [
  { value: 'todo', label: 'To do' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'done', label: 'Done' },
];
