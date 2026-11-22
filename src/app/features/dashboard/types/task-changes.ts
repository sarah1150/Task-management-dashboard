import { Task } from '../models/task';
import { TaskDraft } from './task-draft';

export type TaskChanges = Partial<TaskDraft> & Pick<Task, 'id'>;
