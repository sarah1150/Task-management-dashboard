/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { TaskApiService } from './task-api.service';
import { Task } from '../../features/dashboard/models/task';
import { TaskDraft } from '../../features/dashboard/types/task-draft';

describe('TaskApiService', () => {
  let service: TaskApiService;
  let httpMock: HttpTestingController;

  const mockAssignee = {
    id: 'user-1',
    name: 'Sarah',
    avatar: 'Svg',
    email: 'sarah@company.com',
  };

  const mockDraft: TaskDraft = {
    title: 'Task title',
    description: 'Task description',
    status: 'todo',
    priority: 'high',
    dueDate: '2099-11-23',
    assignee: mockAssignee,
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
    order: 0,
  };

  const mockTasks: Task[] = [
    { ...mockTask, id: '1', order: 0 },
    { ...mockTask, id: '2', order: 1 },
    {
      ...mockTask,
      id: '3',
      status: 'done',
      order: 0,
      completedAt: '2026-11-20T10:00:00.000Z',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TaskApiService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(TaskApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('createTask', () => {
    it('should send a POST request with the new task data', () => {
      service.createTask(mockDraft).subscribe();

      const req = httpMock.expectOne('/api/tasks');

      expect(req.request.method).toBe('POST');
      expect(req.request.body.title).toBe(mockDraft.title);
      expect(req.request.body.description).toBe(mockDraft.description);
      expect(req.request.body.status).toBe(mockDraft.status);
      expect(req.request.body.priority).toBe(mockDraft.priority);
      expect(req.request.body.assignee).toEqual(mockDraft.assignee);
      expect(req.request.body.id).toContain('task-');
      expect(req.request.body.createdAt).toBeTruthy();
      expect(req.request.body.updatedAt).toBeTruthy();
      expect(req.request.body.completedAt).toBeNull();
      expect(req.request.body.isOverdue).toBeFalse();

      req.flush(mockTask);
    });

    it('should return the normalized task', (done) => {
      service.createTask(mockDraft).subscribe((task) => {
        expect(task).toEqual(
          jasmine.objectContaining({
            id: mockTask.id,
            title: mockTask.title,
            completedAt: null,
            isOverdue: false,
            order: mockTask.order,
          }),
        );

        done();
      });

      const req = httpMock.expectOne('/api/tasks');
      req.flush(mockTask);
    });

    it('should set completedAt when creating a completed task', () => {
      const completedDraft: TaskDraft = {
        ...mockDraft,
        status: 'done',
      };

      service.createTask(completedDraft).subscribe();

      const req = httpMock.expectOne('/api/tasks');

      expect(req.request.body.completedAt).toBeTruthy();

      req.flush(mockTask);
    });
  });

  describe('updateTask', () => {
    it('should send a PATCH request with the task changes', () => {
      const changes: Partial<TaskDraft> = {
        title: 'Updated title',
        description: 'Updated description',
      };

      service.updateTask('1', changes).subscribe();

      const req = httpMock.expectOne('/api/tasks/1');

      expect(req.request.method).toBe('PATCH');
      expect(req.request.body.title).toBe('Updated title');
      expect(req.request.body.description).toBe('Updated description');
      expect(req.request.body.updatedAt).toBeTruthy();

      req.flush(mockTask);
    });

    it('should set completedAt when changing status to done', () => {
      service.updateTask('1', { status: 'done' }).subscribe();

      const req = httpMock.expectOne('/api/tasks/1');

      expect(req.request.body.status).toBe('done');
      expect(req.request.body.completedAt).toBeTruthy();

      req.flush(mockTask);
    });

    it('should reset completedAt when changing status from done', () => {
      service.updateTask('1', { status: 'todo' }).subscribe();

      const req = httpMock.expectOne('/api/tasks/1');

      expect(req.request.body.status).toBe('todo');
      expect(req.request.body.completedAt).toBeNull();

      req.flush(mockTask);
    });

    it('should return the normalized task', (done) => {
      service.updateTask('1', { title: 'Updated title' }).subscribe((task) => {
        expect(task.title).toBe('Task title');
        expect(task.completedAt).toBeNull();
        expect(task.order).toBe(0);

        done();
      });

      const req = httpMock.expectOne('/api/tasks/1');
      req.flush(mockTask);
    });
  });

  describe('moveTask', () => {
    it('should throw an error when the task does not exist', () => {
      expect(() => service.moveTask('not-found', 'done', 0, mockTasks)).toThrowError(
        'Task not-found was not found in the NgRx cache.',
      );
    });

    it('should update task order when moving within the same status', (done) => {
      service.moveTask('1', 'todo', 1, mockTasks).subscribe((tasks) => {
        expect(tasks.length).toBe(2);
        expect(tasks[0].id).toBe('2');
        expect(tasks[1].id).toBe('1');

        done();
      });

      const firstRequest = httpMock.expectOne('/api/tasks/2');

      expect(firstRequest.request.method).toBe('PATCH');
      expect(firstRequest.request.body.order).toBe(0);

      firstRequest.flush({ ...mockTasks[1], order: 0 });

      const secondRequest = httpMock.expectOne('/api/tasks/1');

      expect(secondRequest.request.method).toBe('PATCH');
      expect(secondRequest.request.body.order).toBe(1);

      secondRequest.flush({ ...mockTasks[0], order: 1 });
    });

    it('should update task status and reorder source and target tasks', (done) => {
      service.moveTask('1', 'done', 0, mockTasks).subscribe((tasks) => {
        expect(tasks.length).toBe(3);
        expect(tasks[0].id).toBe('1');
        expect(tasks[0].status).toBe('done');

        done();
      });

      const movedTaskRequest = httpMock.expectOne('/api/tasks/1');

      expect(movedTaskRequest.request.method).toBe('PATCH');
      expect(movedTaskRequest.request.body.status).toBe('done');
      expect(movedTaskRequest.request.body.order).toBe(0);
      expect(movedTaskRequest.request.body.completedAt).toBeTruthy();

      movedTaskRequest.flush({
        ...mockTasks[0],
        status: 'done',
        order: 0,
      });

      const targetTaskRequest = httpMock.expectOne('/api/tasks/3');

      expect(targetTaskRequest.request.body.order).toBe(1);

      targetTaskRequest.flush({
        ...mockTasks[2],
        order: 1,
      });

      const sourceTaskRequest = httpMock.expectOne('/api/tasks/2');

      expect(sourceTaskRequest.request.body.status).toBe('todo');
      expect(sourceTaskRequest.request.body.order).toBe(0);

      sourceTaskRequest.flush({
        ...mockTasks[1],
        order: 0,
      });
    });

    it('should reset completedAt when moving a completed task to another status', (done) => {
      service.moveTask('3', 'todo', 0, mockTasks).subscribe(() => {
        done();
      });

      const movedTaskRequest = httpMock.expectOne('/api/tasks/3');

      expect(movedTaskRequest.request.body.status).toBe('todo');
      expect(movedTaskRequest.request.body.completedAt).toBeNull();

      movedTaskRequest.flush({
        ...mockTasks[2],
        status: 'todo',
        completedAt: null,
      });

      const sourceTaskRequest = httpMock.expectOne('/api/tasks/1');
      sourceTaskRequest.flush(mockTasks[0]);

      const secondSourceRequest = httpMock.expectOne('/api/tasks/2');
      secondSourceRequest.flush(mockTasks[1]);
    });
  });

  describe('deleteTask', () => {
    it('should send a DELETE request with the task ID', () => {
      service.deleteTask('1').subscribe();

      const req = httpMock.expectOne('/api/tasks/1');

      expect(req.request.method).toBe('DELETE');

      req.flush(null);
    });
  });
});
