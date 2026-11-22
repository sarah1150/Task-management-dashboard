import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MATERIAL_IMPORTS } from '../../material.imports';
import { TaskDraft } from '../../../features/dashboard/types/task-draft';
import { TASK_STATUSES, TaskStatus } from '../../../features/dashboard/types/task-status';
import { PRIORITIES } from '../../../features/dashboard/types/task-priority';
import { FormValidatorService } from '../../validator/form-validator.service';
import { TaskFormData } from '../../models/task-form-data';
import { TasksPriority } from '../../../features/dashboard/types/task-priority';

@Component({
  selector: 'app-task-form-dialog',
  templateUrl: './task-form-dialog.component.html',
  styleUrls: ['./task-form-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MatDialogModule, ...MATERIAL_IMPORTS],
})
export class TaskFormDialogComponent {
  readonly data = inject<TaskFormData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<TaskFormDialogComponent, TaskDraft>);
  private readonly fb = inject(FormBuilder);
  private readonly validatorService = inject(FormValidatorService);
  readonly priorities = PRIORITIES;
  readonly statuses = TASK_STATUSES;
  readonly form = this.fb.nonNullable.group({
    title: this.fb.nonNullable.control(this.data.task?.title ?? '', [
      Validators.required,
      this.validatorService.nonBlank,
      Validators.maxLength(90),
    ]),
    description: this.fb.nonNullable.control(this.data.task?.description ?? '', [
      Validators.required,
      this.validatorService.nonBlank,
      Validators.maxLength(320),
    ]),
    priority: this.fb.nonNullable.control<TasksPriority>(
      this.data.task?.priority ?? 'medium',
      Validators.required,
    ),
    status: this.fb.nonNullable.control<TaskStatus>(
      this.data.task?.status ?? 'todo',
      Validators.required,
    ),
    dueDate: this.fb.nonNullable.control(
      this.data.task?.dueDate ?? this.validatorService.todayInput(),
      [
        Validators.required,
        this.validatorService.validDate,
        ...(this.data.task ? [] : [this.validatorService.futureDate]),
      ],
    ),
    assigneeId: this.fb.nonNullable.control(
      this.data.task?.assignee.id ?? this.data.users[0]?.id ?? '',
      Validators.required,
    ),
  });

  constructor() {}

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    const assignee = this.data.users.find((user) => user.id === value.assigneeId);
    if (!assignee) return;
    const draft: TaskDraft = {
      title: value.title.trim(),
      description: value.description.trim(),
      priority: value.priority,
      status: value.status,
      dueDate: value.dueDate,
      assignee,
    };
    this.dialogRef.close(draft);
  }
}
