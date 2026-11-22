import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MATERIAL_IMPORTS } from '../../../../shared/material.imports';
import { Task } from '../../models/task';
import { TaskDropEvent } from '../../models/task-drop-event';
import { TaskCardComponent } from '../task-card/task-card.component';
import { TASK_STATUSES, TaskStatus } from '../../types/task-status';

@Component({
  selector: 'app-task-board',
  templateUrl: './task-board.component.html',
  styleUrls: ['./task-board.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [...MATERIAL_IMPORTS, TaskCardComponent, DragDropModule, MatIconModule],
})
export class TaskBoardComponent {
  readonly tasks = input.required<Task[]>();
  readonly edit = output<Task>();
  readonly remove = output<Task>();
  readonly taskMoved = output<TaskDropEvent>();
  readonly columns = TASK_STATUSES;
  readonly groupedTasks = computed(() => {
    const groups: Record<TaskStatus, Task[]> = { todo: [], in_progress: [], done: [] };
    for (const task of this.tasks()) groups[task.status].push(task);
    for (const tasks of Object.values(groups)) tasks.sort((a, b) => a.order - b.order);
    return groups;
  });

  tasksFor(status: TaskStatus): Task[] {
    return this.groupedTasks()[status];
  }

  dropTask(event: CdkDragDrop<Task[]>, status: TaskStatus): void {
    const task = event.item.data as Task;
    this.taskMoved.emit({ task, status, order: event.currentIndex });
  }
}
