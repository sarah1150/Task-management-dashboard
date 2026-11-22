/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { ModalService } from './modal.service';
import { TaskFormDialogComponent } from '../components/task-form-dialog/task-form-dialog.component';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';
import { Assignee } from '../../features/dashboard/models/assignee';
import { Task } from '../../features/dashboard/models/task';
import { TaskDraft } from '../../features/dashboard/types/task-draft';
import * as TaskActions from '../../store/actions/tasks.actions';

describe('ModalService', () => {
  let service: ModalService;
  let openSpy: jasmine.Spy;
  let dispatchSpy: jasmine.Spy;

  const mockAssignee: Assignee = {
    id: 'user-1',
    name: 'Sarah',
    avatar: 'Svg',
    email: 'sarah@company.com',
  };

  const mockUsers: Assignee[] = [mockAssignee];

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
    order: 1,
  } as Task;

  const mockDraft: TaskDraft = {
    title: 'Updated task',
    description: 'Updated description',
    status: 'in_progress',
    priority: 'medium',
    dueDate: '2026-11-25',
    assignee: mockAssignee,
  };

  beforeEach(() => {
    openSpy = jasmine.createSpy('open');
    dispatchSpy = jasmine.createSpy('dispatch');

    TestBed.configureTestingModule({
      providers: [
        ModalService,
        {
          provide: MatDialog,
          useValue: {
            open: openSpy,
          },
        },
        {
          provide: Store,
          useValue: {
            dispatch: dispatchSpy,
          },
        },
      ],
    });

    service = TestBed.inject(ModalService);
  });

  function mockDialogResult(result: TaskDraft | boolean | undefined): void {
    openSpy.and.returnValue({
      afterClosed: () => of(result),
    });
  }

  describe('openCreate', () => {
    it('should open the task form dialog with the provided users', () => {
      mockDialogResult(undefined);

      service.openCreate(mockUsers);

      expect(openSpy).toHaveBeenCalledTimes(1);
      expect(openSpy).toHaveBeenCalledWith(TaskFormDialogComponent, {
        data: { users: mockUsers },
        panelClass: 'task-editor-panel',
        maxWidth: '96vw',
        width: '580px',
      });
    });

    it('should dispatch createTask when the dialog returns a draft', () => {
      mockDialogResult(mockDraft);

      service.openCreate(mockUsers);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(TaskActions.createTask({ draft: mockDraft }));
    });

    it('should not dispatch an action when the dialog is cancelled', () => {
      mockDialogResult(undefined);

      service.openCreate(mockUsers);

      expect(dispatchSpy).not.toHaveBeenCalled();
    });
  });

  describe('openEdit', () => {
    it('should open the task form dialog with the task and users', () => {
      mockDialogResult(undefined);

      service.openEdit(mockUsers, mockTask);

      expect(openSpy).toHaveBeenCalledTimes(1);
      expect(openSpy).toHaveBeenCalledWith(TaskFormDialogComponent, {
        data: {
          users: mockUsers,
          task: mockTask,
        },
        panelClass: 'task-editor-panel',
        maxWidth: '96vw',
        width: '580px',
      });
    });

    it('should dispatch updateTask when the dialog returns a draft', () => {
      mockDialogResult(mockDraft);

      service.openEdit(mockUsers, mockTask);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        TaskActions.updateTask({
          id: mockTask.id,
          changes: mockDraft,
        }),
      );
    });

    it('should not dispatch an action when the dialog is cancelled', () => {
      mockDialogResult(undefined);

      service.openEdit(mockUsers, mockTask);

      expect(dispatchSpy).not.toHaveBeenCalled();
    });
  });

  describe('confirmDelete', () => {
    it('should open the confirmation dialog with the task details', () => {
      mockDialogResult(false);

      service.confirmDelete(mockTask);

      expect(openSpy).toHaveBeenCalledTimes(1);
      expect(openSpy).toHaveBeenCalledWith(ConfirmDialogComponent, {
        data: {
          title: 'Delete this task?',
          message: `“${mockTask.title}” will be removed from the board.`,
        },
        maxWidth: '95vw',
      });
    });

    it('should dispatch deleteTask when deletion is confirmed', () => {
      mockDialogResult(true);

      service.confirmDelete(mockTask);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(TaskActions.deleteTask({ task: mockTask }));
    });

    it('should not dispatch deleteTask when deletion is cancelled', () => {
      mockDialogResult(false);

      service.confirmDelete(mockTask);

      expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it('should not dispatch deleteTask when the dialog returns undefined', () => {
      mockDialogResult(undefined);

      service.confirmDelete(mockTask);

      expect(dispatchSpy).not.toHaveBeenCalled();
    });
  });
});
