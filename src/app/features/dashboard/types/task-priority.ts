export type TasksPriority = 'low' | 'medium' | 'high';

export const PRIORITIES: readonly { value: TasksPriority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];
