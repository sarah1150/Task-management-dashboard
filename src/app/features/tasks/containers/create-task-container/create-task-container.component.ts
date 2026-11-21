import { Component, inject, input, OnInit } from '@angular/core';
import { CreateTaskComponent } from '../../components/create-task/create-task.component';
import { CreateTask } from '../../types/create-task';
import { TaskApiService } from '../../../../core/api/task-api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-task-container',
  templateUrl: './create-task-container.component.html',
  styleUrls: ['./create-task-container.component.css'],
  imports: [CreateTaskComponent],
})
export class CreateTaskContainerComponent implements OnInit {
  private readonly taskService = inject(TaskApiService);
  private readonly _snackBar = inject(MatSnackBar);
  isResetForm = false;

  constructor() {}

  ngOnInit() {}

  createTask(task: CreateTask): void {
    this.taskService.createTask(task).subscribe({
      next: (createdTask) => {
        this.openSnackBar('Task created successfully.', 'Close', {
          panelClass: ['snackbar-success'],
        });
        this.isResetForm = true;
      },
      error: (error) => {
        this.openSnackBar('Failed to create task!', 'Close', { panelClass: ['snackbar-error'] });
      },
    });
  }

  private openSnackBar(message: string, action: string, config?: any) {
    this._snackBar.open(message, action, config);
  }
}
