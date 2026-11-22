/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom, Observable } from 'rxjs';

import { TaskResourceService } from './task-resource.service';
import { Task } from '../../features/dashboard/models/task';
import { Assignee } from '../../features/dashboard/models/assignee';
import { Statistic } from '../../features/dashboard/models/statistic';

describe('TaskResourceService', () => {
  let service: TaskResourceService;
  let httpMock: HttpTestingController;

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
    dueDate: '2099-11-23',
    assignee: mockAssignee,
    createdAt: '2026-11-19T17:29:46.368Z',
    updatedAt: '2026-11-21T17:29:46.368Z',
    completedAt: null,
    isOverdue: false,
    order: 1,
  };

  const mockUsers: Assignee[] = [mockAssignee];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TaskResourceService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(TaskResourceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  type HttpResponseBody = string | number | boolean | object | null;

  async function flushResource<T extends HttpResponseBody>(
    source: Observable<T>,
    url: string,
    response: T,
  ): Promise<T> {
    const resultPromise = firstValueFrom(source);

    TestBed.tick();

    const request = httpMock.expectOne(url);

    expect(request.request.method).toBe('GET');

    request.flush(response);

    TestBed.tick();

    return resultPromise;
  }
  describe('getTasks', () => {
    it('should fetch tasks from the API', async () => {
      const tasks = await flushResource(service.getTasks(), '/api/tasks', [mockTask]);

      expect(tasks.length).toBe(1);
      expect(tasks[0].id).toBe(mockTask.id);
      expect(tasks[0].title).toBe(mockTask.title);
    });

    it('should refine task properties before returning tasks', async () => {
      const tasks = await flushResource(service.getTasks(), '/api/tasks', [mockTask]);

      expect(tasks[0].completedAt).toBeNull();
      expect(tasks[0].order).toBe(1);
      expect(tasks[0].updatedAt).toBe(mockTask.updatedAt);
      expect(tasks[0].isOverdue).toBeFalse();
    });

    it('should mark a task as overdue when its due date is in the past', async () => {
      const overdueTask: Task = {
        ...mockTask,
        dueDate: '2020-01-01',
        status: 'todo',
      };

      const tasks = await flushResource(service.getTasks(), '/api/tasks', [overdueTask]);

      expect(tasks[0].isOverdue).toBeTrue();
    });

    it('should not mark a completed task as overdue', async () => {
      const completedTask: Task = {
        ...mockTask,
        dueDate: '2020-01-01',
        status: 'done',
      };

      const tasks = await flushResource(service.getTasks(), '/api/tasks', [completedTask]);

      expect(tasks[0].isOverdue).toBeFalse();
    });

    it('should return an empty array when there are no tasks', async () => {
      const tasks = await flushResource(service.getTasks(), '/api/tasks', []);

      expect(tasks).toEqual([]);
    });
  });

  describe('getUsers', () => {
    it('should fetch users from the API', async () => {
      const users = await flushResource(service.getUsers(), '/api/users', mockUsers);

      expect(users).toEqual(mockUsers);
    });

    it('should return an empty array when there are no users', async () => {
      const users = await flushResource(service.getUsers(), '/api/users', []);

      expect(users).toEqual([]);
    });
  });

  describe('getStatistics', () => {
    it('should fetch statistics from the API', async () => {
      const statistics: Statistic[] = [];

      const result = await flushResource(service.getStatistics(), '/api/statistics', statistics);

      expect(result).toEqual(statistics);
    });

    it('should return an empty array when there are no statistics', async () => {
      const statistics = await flushResource(service.getStatistics(), '/api/statistics', []);

      expect(statistics).toEqual([]);
    });
  });
});
