import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Store } from '@ngrx/store';
import { MATERIAL_IMPORTS } from '../../../../shared/material.imports';
import * as TaskActions from '../../../../store/actions/tasks.actions';
import { Task } from '../../models/task';
import { TaskDropEvent } from '../../models/task-drop-event';
import { TasksPriority } from '../../types/task-priority';
import { TaskStatus } from '../../types/task-status';
import { TaskBoardComponent } from '../task-board/task-board.component';
import { DashboardData } from '../../models/dashboard-data';
import { ModalService } from '../../../../shared/service/modal.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [...MATERIAL_IMPORTS, TaskBoardComponent],
})
export class DashboardPageComponent {
  private readonly store = inject(Store);
  private readonly modalService = inject(ModalService);
  data = input.required<DashboardData>();
  readonly statusTabs: readonly { label: string; value: TaskStatus | 'all' }[] = [
    { label: 'All tasks', value: 'all' },
    { label: 'To do', value: 'todo' },
    { label: 'In progress', value: 'in_progress' },
    { label: 'Done', value: 'done' },
  ];

  setStatus(status: TaskStatus | 'all'): void {
    this.store.dispatch(TaskActions.setTaskFilters({ filters: { status } }));
  }

  setPriority(priority: TasksPriority): void {
    this.store.dispatch(TaskActions.setTaskFilters({ filters: { priority } }));
  }

  openCreateModal() {
    this.modalService.openCreate(this.data().users);
  }

  openEditModal(task: Task) {
    this.modalService.openEdit(this.data().users, task);
  }

  confirmDeleteTask(task: Task) {
    this.modalService.confirmDelete(task);
  }

  onTaskMoved(event: TaskDropEvent): void {
    this.store.dispatch(
      TaskActions.moveTask({ id: event.task.id, status: event.status, order: event.order }),
    );
  }
}
