import { Task } from '../../features/dashboard/models/task';
import { Assignee } from '../../features/dashboard/models/assignee';
import { Statistic } from '../../features/dashboard/models/statistic';
import { TaskFilters } from '../../features/dashboard/models/task-filters';
import * as TaskActions from '../actions/tasks.actions';
import { initialTasksState, tasksReducer } from './tasks.reducers';

describe('Tasks Reducer', () => {
  const mockAssignee: Assignee = {
    id: 'user-1',
    name: 'Sarah',
    avatar: 'Svg',
    email: 'sarah@company.com',
  };

  const mockTask: Task = {
    id: '1',
    title: 'Task title',
    description: 'Task description',
    status: 'todo',
    priority: 'high',
    dueDate: '2026-11-23',
    assignee: mockAssignee,
    createdAt: '2026-11-19T17:29:46.368Z',
    updatedAt: '2026-11-21T17:29:46.368Z',
    completedAt: null,
    isOverdue: false,
    order: 1,
  } as Task;

  const anotherTask: Task = {
    ...mockTask,
    id: '2',
    title: 'Another task',
    status: 'in_progress',
    priority: 'medium',
  };

  const mockTasks: Task[] = [mockTask, anotherTask];

  const mockFilters: TaskFilters = {
    query: 'dashboard',
    status: 'todo',
    priority: 'high',
  };

  const mockUsers: Assignee[] = [mockAssignee];

  const mockStatistics: Statistic[] = [];

  describe('Initial state', () => {
    it('should return the initial state', () => {
      expect(tasksReducer(undefined, { type: 'unknown' })).toEqual(initialTasksState);
    });
  });

  describe('Tasks loading', () => {
    it('should set loading to true and clear error when tasks loading starts', () => {
      const state = tasksReducer(
        { ...initialTasksState, error: 'Previous error' },
        TaskActions.tasksLoadStarted(),
      );

      expect(state.loading).toBeTrue();
      expect(state.error).toBeNull();
    });

    it('should store tasks when tasks are loaded', () => {
      const state = tasksReducer(initialTasksState, TaskActions.tasksLoaded({ tasks: mockTasks }));

      expect(state.tasks).toEqual(mockTasks);
      expect(state.tasksLoaded).toBeTrue();
      expect(state.loading).toBeFalse();
      expect(state.error).toBeNull();
    });

    it('should store error when tasks loading fails', () => {
      const state = tasksReducer(
        initialTasksState,
        TaskActions.tasksLoadFailed({ message: 'Failed to load tasks' }),
      );

      expect(state.loading).toBeFalse();
      expect(state.error).toBe('Failed to load tasks');
    });
  });

  describe('Users loading', () => {
    it('should set usersLoading to true and clear usersError', () => {
      const state = tasksReducer(
        { ...initialTasksState, usersError: 'Previous error' },
        TaskActions.usersLoadStarted(),
      );

      expect(state.usersLoading).toBeTrue();
      expect(state.usersError).toBeNull();
    });

    it('should store users when users are loaded', () => {
      const state = tasksReducer(initialTasksState, TaskActions.usersLoaded({ users: mockUsers }));

      expect(state.users).toEqual(mockUsers);
      expect(state.usersLoaded).toBeTrue();
      expect(state.usersLoading).toBeFalse();
      expect(state.usersError).toBeNull();
    });

    it('should store error when users loading fails', () => {
      const state = tasksReducer(
        initialTasksState,
        TaskActions.usersLoadFailed({ message: 'Failed to load users' }),
      );

      expect(state.usersLoading).toBeFalse();
      expect(state.usersError).toBe('Failed to load users');
    });
  });

  describe('Statistics loading', () => {
    it('should set statisticsLoading to true and clear statisticsError', () => {
      const state = tasksReducer(
        { ...initialTasksState, statisticsError: 'Previous error' },
        TaskActions.statisticsLoadStarted(),
      );

      expect(state.statisticsLoading).toBeTrue();
      expect(state.statisticsError).toBeNull();
    });

    it('should store statistics when they are loaded', () => {
      const state = tasksReducer(
        initialTasksState,
        TaskActions.statisticsLoaded({ statistics: mockStatistics }),
      );

      expect(state.statistics).toEqual(mockStatistics);
      expect(state.statisticsLoaded).toBeTrue();
      expect(state.statisticsLoading).toBeFalse();
      expect(state.statisticsError).toBeNull();
    });

    it('should store error when statistics loading fails', () => {
      const state = tasksReducer(
        initialTasksState,
        TaskActions.statisticsLoadFailed({ message: 'Failed to load statistics' }),
      );

      expect(state.statisticsLoading).toBeFalse();
      expect(state.statisticsError).toBe('Failed to load statistics');
    });
  });

  describe('Task operations started', () => {
    it('should set loading to true when creating a task', () => {
      const state = tasksReducer(initialTasksState, TaskActions.createTask({ draft: mockTask }));

      expect(state.loading).toBeTrue();
      expect(state.error).toBeNull();
    });

    it('should set loading to true when updating a task', () => {
      const state = tasksReducer(
        initialTasksState,
        TaskActions.updateTask({ id: mockTask.id, changes: mockTask }),
      );

      expect(state.loading).toBeTrue();
      expect(state.error).toBeNull();
    });

    it('should set loading to true when moving a task', () => {
      const state = tasksReducer(
        initialTasksState,
        TaskActions.moveTask({
          id: mockTask.id,
          status: 'done',
          order: 1,
        }),
      );

      expect(state.loading).toBeTrue();
      expect(state.error).toBeNull();
    });

    it('should set loading to true when deleting a task', () => {
      const state = tasksReducer(initialTasksState, TaskActions.deleteTask({ task: mockTask }));

      expect(state.loading).toBeTrue();
      expect(state.error).toBeNull();
    });
  });

  describe('Task operations succeeded', () => {
    it('should insert a created task at the beginning of the list', () => {
      const state = tasksReducer(
        { ...initialTasksState, tasks: [anotherTask], loading: true },
        TaskActions.createTaskSucceeded({ task: mockTask }),
      );

      expect(state.tasks).toEqual([mockTask, anotherTask]);
      expect(state.loading).toBeFalse();
      expect(state.error).toBeNull();
    });

    it('should replace an existing task when updating it', () => {
      const updatedTask: Task = {
        ...mockTask,
        title: 'Updated title',
      };

      const state = tasksReducer(
        { ...initialTasksState, tasks: [mockTask, anotherTask], loading: true },
        TaskActions.updateTaskSucceeded({ task: updatedTask }),
      );

      expect(state.tasks[0]).toEqual(updatedTask);
      expect(state.tasks.length).toBe(2);
      expect(state.loading).toBeFalse();
      expect(state.error).toBeNull();
    });

    it('should insert the task if it does not exist during update', () => {
      const state = tasksReducer(
        { ...initialTasksState, tasks: [anotherTask], loading: true },
        TaskActions.updateTaskSucceeded({ task: mockTask }),
      );

      expect(state.tasks).toEqual([mockTask, anotherTask]);
    });

    it('should insert a task when it does not exist during create', () => {
      const state = tasksReducer(
        { ...initialTasksState, tasks: [anotherTask], loading: true },
        TaskActions.createTaskSucceeded({ task: mockTask }),
      );

      expect(state.tasks).toEqual([mockTask, anotherTask]);
    });

    it('should update or insert reordered tasks when moving tasks', () => {
      const reorderedTasks: Task[] = [
        { ...mockTask, status: 'done', order: 2 },
        { ...anotherTask, status: 'done', order: 1 },
      ];

      const state = tasksReducer(
        { ...initialTasksState, tasks: [mockTask, anotherTask], loading: true },
        TaskActions.moveTaskSucceeded({
          task: mockTask,
          reorderedTasks,
        }),
      );

      expect(state.tasks).toEqual(reorderedTasks);
      expect(state.loading).toBeFalse();
      expect(state.error).toBeNull();
    });

    it('should insert reordered tasks that do not already exist', () => {
      const reorderedTasks: Task[] = [{ ...mockTask, id: '3' }];

      const state = tasksReducer(
        { ...initialTasksState, tasks: [mockTask], loading: true },
        TaskActions.moveTaskSucceeded({
          task: mockTask,
          reorderedTasks,
        }),
      );

      expect(state.tasks.length).toBe(2);
      expect(state.tasks[0].id).toBe('3');
    });

    it('should delete a task from the list', () => {
      const state = tasksReducer(
        { ...initialTasksState, tasks: mockTasks, loading: true },
        TaskActions.deleteTaskSucceeded({ task: mockTask }),
      );

      expect(state.tasks).toEqual([anotherTask]);
      expect(state.loading).toBeFalse();
      expect(state.error).toBeNull();
    });
  });

  describe('Task operations failed', () => {
    it('should handle create task failure', () => {
      const state = tasksReducer(
        initialTasksState,
        TaskActions.createTaskFailed({ message: 'Create failed' }),
      );

      expect(state.loading).toBeFalse();
      expect(state.error).toBe('Create failed');
    });

    it('should handle update task failure', () => {
      const state = tasksReducer(
        initialTasksState,
        TaskActions.updateTaskFailed({ message: 'Update failed' }),
      );

      expect(state.loading).toBeFalse();
      expect(state.error).toBe('Update failed');
    });

    it('should handle move task failure', () => {
      const state = tasksReducer(
        initialTasksState,
        TaskActions.moveTaskFailed({ message: 'Move failed' }),
      );

      expect(state.loading).toBeFalse();
      expect(state.error).toBe('Move failed');
    });

    it('should handle delete task failure', () => {
      const state = tasksReducer(
        initialTasksState,
        TaskActions.deleteTaskFailed({ message: 'Delete failed' }),
      );

      expect(state.loading).toBeFalse();
      expect(state.error).toBe('Delete failed');
    });
  });

  describe('Task filters', () => {
    it('should update task filters', () => {
      const state = tasksReducer(
        initialTasksState,
        TaskActions.setTaskFilters({ filters: mockFilters }),
      );

      expect(state.filters).toEqual(mockFilters);
    });

    it('should preserve existing filters when partially updating them', () => {
      const filters: Partial<TaskFilters> = {
        query: 'dashboard',
      };

      const state = tasksReducer(initialTasksState, TaskActions.setTaskFilters({ filters }));

      expect(state.filters).toEqual({
        query: 'dashboard',
        status: 'all',
        priority: 'all',
      });
    });
  });

  describe('Clear task error', () => {
    it('should clear the task error', () => {
      const state = tasksReducer(
        { ...initialTasksState, error: 'Something went wrong' },
        TaskActions.clearTaskError(),
      );

      expect(state.error).toBeNull();
    });
  });
});
