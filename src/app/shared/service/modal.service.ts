import { inject, Injectable, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Task } from '../../features/dashboard/models/task';
import { TaskDraft } from '../../features/dashboard/types/task-draft';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';
import { TaskFormDialogComponent } from '../components/task-form-dialog/task-form-dialog.component';
import { TaskFormData } from '../models/task-form-data';
import * as TaskActions from '../../store/actions/tasks.actions';
import { Assignee } from '../../features/dashboard/models/assignee';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private readonly dialog = inject(MatDialog);
  private readonly store = inject(Store);
  navOpen = signal(false);

  openCreate(users: Assignee[]): void {
    const data: TaskFormData = { users };
    this.dialog
      .open(TaskFormDialogComponent, {
        data,
        panelClass: 'task-editor-panel',
        maxWidth: '96vw',
        width: '580px',
      })
      .afterClosed()
      .subscribe((draft: TaskDraft | undefined) => {
        if (draft) this.store.dispatch(TaskActions.createTask({ draft }));
      });
  }

  openEdit(users: Assignee[], task: Task): void {
    const data: TaskFormData = { users, task };
    this.dialog
      .open(TaskFormDialogComponent, {
        data,
        panelClass: 'task-editor-panel',
        maxWidth: '96vw',
        width: '580px',
      })
      .afterClosed()
      .subscribe((draft: TaskDraft | undefined) => {
        if (draft) this.store.dispatch(TaskActions.updateTask({ id: task.id, changes: draft }));
      });
  }

  confirmDelete(task: Task): void {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          title: 'Delete this task?',
          message: `“${task.title}” will be removed from the board.`,
        },
        maxWidth: '95vw',
      })
      .afterClosed()
      .subscribe((confirmed: boolean | undefined) => {
        if (confirmed) this.store.dispatch(TaskActions.deleteTask({ task }));
      });
  }

  closeNavigation(): void {
    this.navOpen.set(false);
  }
}
