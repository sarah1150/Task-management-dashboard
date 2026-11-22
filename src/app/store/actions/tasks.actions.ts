import { createAction, props } from '@ngrx/store';
import { Statistic } from '../../features/dashboard/models/statistic';
import { Task } from '../../features/dashboard/models/task';
import { TaskDraft } from '../../features/dashboard/types/task-draft';
import { TasksPriority } from '../../features/dashboard/types/task-priority';
import { TaskStatus } from '../../features/dashboard/types/task-status';
import { Assignee } from '../../features/dashboard/models/assignee';

export const loadTasks = createAction('[Tasks] Load', props<{ force?: boolean }>());
export const tasksLoadStarted = createAction('[Tasks API] Load started');
export const tasksLoaded = createAction('[Tasks API] Loaded', props<{ tasks: Task[] }>());
export const tasksLoadFailed = createAction(
  '[Tasks API] Load failed',
  props<{ message: string }>(),
);

export const loadUsers = createAction('[Users] Load', props<{ force?: boolean }>());
export const usersLoadStarted = createAction('[Users API] Load started');
export const usersLoaded = createAction('[Users API] Loaded', props<{ users: Assignee[] }>());
export const usersLoadFailed = createAction(
  '[Users API] Load failed',
  props<{ message: string }>(),
);

export const loadStatistics = createAction('[Statistics] Load', props<{ force?: boolean }>());
export const statisticsLoadStarted = createAction('[Statistics API] Load started');
export const statisticsLoaded = createAction(
  '[Statistics API] Loaded',
  props<{ statistics: Statistic[] }>(),
);
export const statisticsLoadFailed = createAction(
  '[Statistics API] Load failed',
  props<{ message: string }>(),
);

export const createTask = createAction('[Tasks] Create', props<{ draft: TaskDraft }>());
export const createTaskSucceeded = createAction(
  '[Tasks API] Create succeeded',
  props<{ task: Task }>(),
);
export const createTaskFailed = createAction(
  '[Tasks API] Create failed',
  props<{ message: string }>(),
);

export const updateTask = createAction(
  '[Tasks] Update',
  props<{ id: string; changes: Partial<TaskDraft> }>(),
);
export const updateTaskSucceeded = createAction(
  '[Tasks API] Update succeeded',
  props<{ task: Task }>(),
);
export const updateTaskFailed = createAction(
  '[Tasks API] Update failed',
  props<{ message: string }>(),
);

export const moveTask = createAction(
  '[Tasks] Move',
  props<{ id: string; status: TaskStatus; order: number }>(),
);
export const moveTaskSucceeded = createAction(
  '[Tasks API] Move succeeded',
  props<{ task: Task; reorderedTasks: Task[] }>(),
);
export const moveTaskFailed = createAction('[Tasks API] Move failed', props<{ message: string }>());

export const deleteTask = createAction('[Tasks] Delete', props<{ task: Task }>());
export const deleteTaskSucceeded = createAction(
  '[Tasks API] Delete succeeded',
  props<{ task: Task }>(),
);
export const deleteTaskFailed = createAction(
  '[Tasks API] Delete failed',
  props<{ message: string }>(),
);

export const setTaskFilters = createAction(
  '[Tasks] Set filters',
  props<{
    filters: Partial<{
      query: string;
      status: TaskStatus | 'all';
      priority: TasksPriority | 'all';
    }>;
  }>(),
);

export const clearTaskError = createAction('[Tasks] Clear error');
