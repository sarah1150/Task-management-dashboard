import { Task } from '../../features/dashboard/models/task';
import { TasksState } from '../reducers/tasks.reducers';
import { TaskStatus } from '../../features/dashboard/types/task-status';

import {
  selectTasksState,
  selectTasks,
  selectTasksLoaded,
  selectTasksLoading,
  selectTasksError,
  selectUsers,
  selectUsersLoaded,
  selectUsersLoading,
  selectUsersError,
  selectStatistics,
  selectStatisticsLoaded,
  selectStatisticsLoading,
  selectStatisticsError,
  selectTaskFilters,
  selectFilteredTasks,
  selectTaskCounts,
} from './tasks.selectors';
import { TaskFilters } from '../../features/dashboard/models/task-filters';

describe('Tasks Selectors', () => {
  const mockTask: Task = {
    id: '1',
    title: 'Task title',
    description: 'Task description',
    status: 'todo',
    priority: 'high',
    dueDate: '2026-11-23',
    assignee: {
      id: 'user-1',
      name: 'Sarah',
      avatar: 'Svg',
      email: 'sarah@company.com',
    },
    createdAt: '2026-11-19T17:29:46.368Z',
    updatedAt: '2026-11-21T17:29:46.368Z',
    completedAt: null,
    isOverdue: false,
    order: 1,
  };

  const mockTasks: Task[] = [
    mockTask,
    {
      ...mockTask,
      id: '2',
      title: 'Design dashboard',
      description: 'Create dashboard UI',
      status: 'in_progress',
      priority: 'medium',
      isOverdue: true,
    },
    {
      ...mockTask,
      id: '3',
      title: 'Fix login',
      description: 'Fix login issue',
      status: 'done',
      priority: 'low',
    },
    {
      ...mockTask,
      id: '4',
      title: 'Update dashboard',
      description: 'Improve dashboard performance',
      status: 'todo',
      priority: 'medium',
      isOverdue: true,
    },
  ];

  const mockState: TasksState = {
    tasks: mockTasks,
    tasksLoaded: true,
    loading: false,
    error: null,
    users: [],
    usersLoaded: true,
    usersLoading: false,
    usersError: null,
    statistics: [],
    statisticsLoaded: true,
    statisticsLoading: false,
    statisticsError: null,
    filters: {
      query: '',
      status: 'all',
      priority: 'all',
    },
  };

  describe('Basic selectors', () => {
    it('should select the tasks state', () => {
      expect(selectTasksState.projector(mockState)).toEqual(mockState);
    });

    it('should select tasks', () => {
      expect(selectTasks.projector(mockState)).toEqual(mockTasks);
    });

    it('should select tasksLoaded', () => {
      expect(selectTasksLoaded.projector(mockState)).toBeTrue();
    });

    it('should select loading', () => {
      expect(selectTasksLoading.projector(mockState)).toBeFalse();
    });

    it('should select tasks error', () => {
      expect(selectTasksError.projector(mockState)).toBeNull();
    });

    it('should select users', () => {
      expect(selectUsers.projector(mockState)).toEqual([]);
    });

    it('should select usersLoaded', () => {
      expect(selectUsersLoaded.projector(mockState)).toBeTrue();
    });

    it('should select usersLoading', () => {
      expect(selectUsersLoading.projector(mockState)).toBeFalse();
    });

    it('should select users error', () => {
      expect(selectUsersError.projector(mockState)).toBeNull();
    });

    it('should select statistics', () => {
      expect(selectStatistics.projector(mockState)).toEqual([]);
    });

    it('should select statisticsLoaded', () => {
      expect(selectStatisticsLoaded.projector(mockState)).toBeTrue();
    });

    it('should select statisticsLoading', () => {
      expect(selectStatisticsLoading.projector(mockState)).toBeFalse();
    });

    it('should select statistics error', () => {
      expect(selectStatisticsError.projector(mockState)).toBeNull();
    });

    it('should select task filters', () => {
      expect(selectTaskFilters.projector(mockState)).toEqual(mockState.filters);
    });
  });

  describe('selectFilteredTasks', () => {
    it('should return all tasks when no filters are applied', () => {
      const result = selectFilteredTasks.projector(mockTasks, mockState.filters);

      expect(result).toEqual(mockTasks);
    });

    it('should filter tasks by search query', () => {
      const filters = {
        query: 'dashboard',
        status: 'all',
        priority: 'all',
      } as TaskFilters;

      const result = selectFilteredTasks.projector(mockTasks, filters);

      expect(result.length).toBe(2);
      expect(result.map((task) => task.id)).toEqual(['2', '4']);
    });

    it('should ignore uppercase and surrounding spaces in search query', () => {
      const filters = {
        query: '  DASHBOARD  ',
        status: 'all',
        priority: 'all',
      } as TaskFilters;

      const result = selectFilteredTasks.projector(mockTasks, filters);

      expect(result.length).toBe(2);
    });

    it('should filter tasks by status', () => {
      const filters = {
        query: '',
        status: 'todo',
        priority: 'all',
      } as TaskFilters;

      const result = selectFilteredTasks.projector(mockTasks, filters);

      expect(result.length).toBe(2);
      expect(result.every((task) => task.status === 'todo')).toBeTrue();
    });

    it('should filter tasks by priority', () => {
      const filters = {
        query: '',
        status: 'all',
        priority: 'high',
      } as TaskFilters;

      const result = selectFilteredTasks.projector(mockTasks, filters);

      expect(result.length).toBe(1);
      expect(result[0].priority).toBe('high');
    });

    it('should combine query, status, and priority filters', () => {
      const filters = {
        query: 'dashboard',
        status: 'todo',
        priority: 'medium',
      } as TaskFilters;

      const result = selectFilteredTasks.projector(mockTasks, filters);

      expect(result.length).toBe(1);
      expect(result[0].id).toBe('4');
    });

    it('should return an empty array when no tasks match', () => {
      const filters = {
        query: 'unknown task',
        status: 'all',
        priority: 'all',
      } as TaskFilters;

      const result = selectFilteredTasks.projector(mockTasks, filters);

      expect(result).toEqual([]);
    });
  });

  describe('selectTaskCounts', () => {
    it('should calculate total tasks count', () => {
      const result = selectTaskCounts.projector(mockTasks);

      expect(result.total).toBe(4);
    });

    it('should calculate tasks count by status', () => {
      const result = selectTaskCounts.projector(mockTasks);

      expect(result.todo).toBe(2);
      expect(result.inProgress).toBe(1);
      expect(result.done).toBe(1);
    });

    it('should calculate overdue tasks count', () => {
      const result = selectTaskCounts.projector(mockTasks);

      expect(result.overdue).toBe(2);
    });

    it('should calculate tasks count by priority', () => {
      const result = selectTaskCounts.projector(mockTasks);

      expect(result.byPriority).toEqual({
        high: 1,
        medium: 2,
        low: 1,
      });
    });

    it('should calculate tasks count by status object', () => {
      const result = selectTaskCounts.projector(mockTasks);

      expect(result.byStatus).toEqual({
        todo: 2,
        in_progress: 1,
        done: 1,
      } satisfies Record<TaskStatus, number>);
    });

    it('should return zero counts when there are no tasks', () => {
      const result = selectTaskCounts.projector([]);

      expect(result).toEqual({
        total: 0,
        todo: 0,
        inProgress: 0,
        done: 0,
        overdue: 0,
        byPriority: {
          high: 0,
          medium: 0,
          low: 0,
        },
        byStatus: {
          todo: 0,
          in_progress: 0,
          done: 0,
        },
      });
    });
  });
});
