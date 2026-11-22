import { Assignee } from '../../features/dashboard/models/assignee';
import { Task } from '../../features/dashboard/models/task';

export interface TaskFormData {
  task?: Task;
  users: Assignee[];
}
