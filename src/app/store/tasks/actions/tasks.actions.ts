import { createAction, props } from '@ngrx/store';
import { Task } from '../../../features/tasks/models/task';
import { CreateTask } from '../../../features/tasks/types/create-task';
import { TaskStatus } from '../../../features/tasks/types/task-status';

// Load Action
export const loadTasks = createAction('[Tasks] Load', props<{ force?: boolean }>());
export const tasksLoadStarted = createAction('[Tasks API] Load started');
export const tasksLoaded = createAction('[Tasks API] Loaded', props<{ tasks: Task[] }>());
export const tasksLoadFailed = createAction(
  '[Tasks API] Load failed',
  props<{ message: string }>(),
);

// Create Action
export const createTask = createAction('[Tasks] Create', props<{ task: CreateTask }>());
export const createTaskSucceeded = createAction(
  '[Tasks API] Create succeeded',
  props<{ task: Task }>(),
);
export const createTaskFailed = createAction(
  '[Tasks API] Create failed',
  props<{ message: string }>(),
);

// Update Action
export const updateTask = createAction(
  '[Tasks] Update',
  props<{ id: string; changes: Partial<CreateTask> }>(),
);
export const updateTaskSucceeded = createAction(
  '[Tasks API] Update succeeded',
  props<{ task: Task }>(),
);
export const updateTaskFailed = createAction(
  '[Tasks API] Update failed',
  props<{ message: string }>(),
);

// Delete Action
export const deleteTask = createAction('[Tasks] Delete', props<{ task: Task }>());
export const deleteTaskSucceeded = createAction(
  '[Tasks API] Delete succeeded',
  props<{ task: Task }>(),
);
export const deleteTaskFailed = createAction(
  '[Tasks API] Delete failed',
  props<{ message: string }>(),
);

// Move Action
export const moveTask = createAction(
  '[Tasks] Move',
  props<{ id: string; status: TaskStatus; order: number }>(),
);
export const moveTaskSucceeded = createAction(
  '[Tasks API] Move succeeded',
  props<{ task: Task; reorderedTasks: Task[] }>(),
);
export const moveTaskFailed = createAction('[Tasks API] Move failed', props<{ message: string }>());

// Clear Error Action
export const clearTaskError = createAction('[Tasks] Clear error');
