import { createReducer, on } from '@ngrx/store';
import { Task } from '../../../features/tasks/models/task';
import * as TaskActions from '../actions/tasks.actions';

export interface TasksState {
  tasks: Task[];
  tasksLoaded: boolean;
  loading: boolean;
  error: string | null;
}

export const initialTasksState: TasksState = {
  tasks: [],
  tasksLoaded: false,
  loading: true,
  error: null,
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

  on(TaskActions.clearTaskError, (state) => ({ ...state, error: null })),
);
