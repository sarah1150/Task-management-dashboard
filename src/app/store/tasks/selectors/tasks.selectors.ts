import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TasksState } from '../reducers/tasks.reducers';
import { Task } from '../../../features/tasks/models/task';
import { TaskStatus } from '../../../features/tasks/types/task-status';
import { TasksPriority } from '../../../features/tasks/types/tasks-priority';

export const selectTasksState = createFeatureSelector<TasksState>('tasks');
export const selectTasks = createSelector(selectTasksState, (state) => state.tasks);
export const selectTasksLoaded = createSelector(selectTasksState, (state) => state.tasksLoaded);
export const selectTasksLoading = createSelector(selectTasksState, (state) => state.loading);
export const selectTasksError = createSelector(selectTasksState, (state) => state.error);

export const selectTaskCounts = createSelector(selectTasks, (tasks: Task[]) => ({
  total: tasks.length,
  todo: tasks.filter((task) => task.status === TaskStatus.TODO).length,
  inProgress: tasks.filter((task) => task.status === TaskStatus.IN_PROGRESS).length,
  done: tasks.filter((task) => task.status === TaskStatus.DONE).length,
  overdue: tasks.filter((task) => task.isOverdue).length,
  byPriority: {
    high: tasks.filter((task) => task.priority === TasksPriority.HIGH).length,
    medium: tasks.filter((task) => task.priority === TasksPriority.MEDIUM).length,
    low: tasks.filter((task) => task.priority === TasksPriority.LOW).length,
  },
  byStatus: Object.fromEntries(
    Object.values(TaskStatus).map((status) => [
      status,
      tasks.filter((task) => task.status === status).length,
    ]),
  ) as Record<TaskStatus, number>,
}));
