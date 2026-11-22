import { createReducer, on } from '@ngrx/store';
import { Task } from '../../features/dashboard/models/task';
import * as TaskActions from '../actions/tasks.actions';
import { TaskFilters } from '../../features/dashboard/models/task-filters';
import { Assignee } from '../../features/dashboard/models/assignee';
import { Statistic } from '../../features/dashboard/models/statistic';

export interface TasksState {
  tasks: Task[];
  tasksLoaded: boolean;
  loading: boolean;
  error: string | null;
  users: Assignee[];
  usersLoaded: boolean;
  usersLoading: boolean;
  usersError: string | null;
  statistics: Statistic[];
  statisticsLoaded: boolean;
  statisticsLoading: boolean;
  statisticsError: string | null;
  filters: TaskFilters;
}

export const initialTasksState: TasksState = {
  tasks: [],
  tasksLoaded: false,
  loading: true,
  error: null,
  users: [],
  usersLoaded: false,
  usersLoading: false,
  usersError: null,
  statistics: [],
  statisticsLoaded: false,
  statisticsLoading: false,
  statisticsError: null,
  filters: { query: '', status: 'all', priority: 'all' },
};

/* Helper function to update if task already exists
if Not exists it inserts the task */
function updateOrInsertTask(tasks: Task[], updated: Task): Task[] {
  return tasks.some((task) => task.id === updated.id)
    ? tasks.map((task) => (task.id === updated.id ? updated : task))
    : [updated, ...tasks];
}

export const tasksReducer = createReducer(
  initialTasksState,
  on(TaskActions.tasksLoadStarted, (state) => ({ ...state, loading: true, error: null })),
  on(TaskActions.tasksLoaded, (state, { tasks }) => ({
    ...state,
    tasks,
    tasksLoaded: true,
    loading: false,
    error: null,
  })),
  on(TaskActions.tasksLoadFailed, (state, { message }) => ({
    ...state,
    loading: false,
    error: message,
  })),

  on(TaskActions.usersLoadStarted, (state) => ({ ...state, usersLoading: true, usersError: null })),
  on(TaskActions.usersLoaded, (state, { users }) => ({
    ...state,
    users,
    usersLoaded: true,
    usersLoading: false,
    usersError: null,
  })),
  on(TaskActions.usersLoadFailed, (state, { message }) => ({
    ...state,
    usersLoading: false,
    usersError: message,
  })),
  on(TaskActions.statisticsLoadStarted, (state) => ({
    ...state,
    statisticsLoading: true,
    statisticsError: null,
  })),

  on(TaskActions.statisticsLoaded, (state, { statistics }) => ({
    ...state,
    statistics,
    statisticsLoaded: true,
    statisticsLoading: false,
    statisticsError: null,
  })),
  on(TaskActions.statisticsLoadFailed, (state, { message }) => ({
    ...state,
    statisticsLoading: false,
    statisticsError: message,
  })),

  on(
    TaskActions.createTask,
    TaskActions.updateTask,
    TaskActions.moveTask,
    TaskActions.deleteTask,
    (state) => ({
      ...state,
      loading: true,
      error: null,
    }),
  ),

  on(TaskActions.createTaskSucceeded, (state, { task }) => ({
    ...state,
    tasks: updateOrInsertTask(state.tasks, task),
    loading: false,
    error: null,
  })),
  on(TaskActions.updateTaskSucceeded, (state, { task }) => ({
    ...state,
    tasks: updateOrInsertTask(state.tasks, task),
    loading: false,
    error: null,
  })),
  on(TaskActions.moveTaskSucceeded, (state, { reorderedTasks }) => {
    return {
      ...state,
      tasks: reorderedTasks.reduce(updateOrInsertTask, state.tasks),
      loading: false,
      error: null,
    };
  }),
  on(TaskActions.deleteTaskSucceeded, (state, { task }) => ({
    ...state,
    tasks: state.tasks.filter((item) => item.id !== task.id),
    loading: false,
    error: null,
  })),

  on(
    TaskActions.createTaskFailed,
    TaskActions.updateTaskFailed,
    TaskActions.moveTaskFailed,
    TaskActions.deleteTaskFailed,
    (state, { message }) => ({ ...state, loading: false, error: message }),
  ),

  on(TaskActions.setTaskFilters, (state, { filters }) => ({
    ...state,
    filters: { ...state.filters, ...filters },
  })),

  on(TaskActions.clearTaskError, (state) => ({ ...state, error: null })),
);
