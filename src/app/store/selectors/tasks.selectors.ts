import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Task } from '../../features/dashboard/models/task';
import { TasksState } from '../reducers/tasks.reducers';
import { TaskStatus } from '../../features/dashboard/types/task-status';

export const selectTasksState = createFeatureSelector<TasksState>('tasks');
export const selectTasks = createSelector(selectTasksState, (state) => state.tasks);
export const selectTasksLoaded = createSelector(selectTasksState, (state) => state.tasksLoaded);
export const selectTasksLoading = createSelector(selectTasksState, (state) => state.loading);
export const selectTasksError = createSelector(selectTasksState, (state) => state.error);
export const selectUsers = createSelector(selectTasksState, (state) => state.users);
export const selectUsersLoaded = createSelector(selectTasksState, (state) => state.usersLoaded);
export const selectUsersLoading = createSelector(selectTasksState, (state) => state.usersLoading);
export const selectUsersError = createSelector(selectTasksState, (state) => state.usersError);
export const selectStatistics = createSelector(selectTasksState, (state) => state.statistics);
export const selectStatisticsLoaded = createSelector(
  selectTasksState,
  (state) => state.statisticsLoaded,
);
export const selectStatisticsLoading = createSelector(
  selectTasksState,
  (state) => state.statisticsLoading,
);
export const selectStatisticsError = createSelector(
  selectTasksState,
  (state) => state.statisticsError,
);
export const selectTaskFilters = createSelector(selectTasksState, (state) => state.filters);

export const selectFilteredTasks = createSelector(
  selectTasks,
  selectTaskFilters,
  (tasks, filters) => {
    const query = filters.query.trim().toLowerCase();
    return tasks.filter((task) => {
      const matchesQuery =
        !query || `${task.title} ${task.description}`.toLowerCase().includes(query);
      const matchesStatus = filters.status === 'all' || task.status === filters.status;
      const matchesPriority = filters.priority === 'all' || task.priority === filters.priority;
      return matchesQuery && matchesStatus && matchesPriority;
    });
  },
);

export const selectTaskCounts = createSelector(selectTasks, (tasks: Task[]) => ({
  total: tasks.length,
  todo: tasks.filter((task) => task.status === 'todo').length,
  inProgress: tasks.filter((task) => task.status === 'in_progress').length,
  done: tasks.filter((task) => task.status === 'done').length,
  overdue: tasks.filter((task) => task.isOverdue).length,
  byPriority: {
    high: tasks.filter((task) => task.priority === 'high').length,
    medium: tasks.filter((task) => task.priority === 'medium').length,
    low: tasks.filter((task) => task.priority === 'low').length,
  },
  byStatus: Object.fromEntries(
    (['todo', 'in_progress', 'done'] as TaskStatus[]).map((status) => [
      status,
      tasks.filter((task) => task.status === status).length,
    ]),
  ) as Record<TaskStatus, number>,
}));
