import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MATERIAL_IMPORTS } from '../../../../shared/material.imports';
import { CreateTask } from '../../types/create-task';
import { TaskStatus } from '../../types/task-status';
import { TasksPriority } from '../../types/tasks-priority';
import { FormValidatorService } from '../../validator/form-validator.service';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css'],
  imports: [ReactiveFormsModule, ...MATERIAL_IMPORTS],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateTaskComponent {
  private readonly fb = inject(FormBuilder);
  private readonly formValidatorService = inject(FormValidatorService);
  taskCreated = output<CreateTask>();
  isResetForm = input<boolean>(false);
  priorities = Object.values(TasksPriority);
  statuses = Object.values(TaskStatus);
  users = [
    { id: '1', name: 'John Doe', email: 'john.doe@example.com', avatar: 'john.jpg' },
    { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', avatar: 'jane.jpg' },
  ];

  readonly form = this.fb.nonNullable.group({
    title: this.fb.nonNullable.control('', [
      Validators.required,
      this.formValidatorService.nonBlank,
      Validators.maxLength(90),
    ]),
    description: this.fb.nonNullable.control('', [
      Validators.required,
      this.formValidatorService.nonBlank,
      Validators.maxLength(320),
    ]),
    priority: this.fb.nonNullable.control<TasksPriority>(TasksPriority.MEDIUM, Validators.required),
    status: this.fb.nonNullable.control<TaskStatus>(TaskStatus.TODO, Validators.required),
    dueDate: this.fb.nonNullable.control(this.formValidatorService.todayInput(), [
      Validators.required,
      this.formValidatorService.validDate,
    ]),
    assigneeId: this.fb.nonNullable.control('', Validators.required),
  });

  constructor() {
    effect(() => {
      if (this.isResetForm()) {
        this.form.reset();
      }
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const assignee = this.users.find((user) => user.id === value.assigneeId);
    if (!assignee) return;
    let task: CreateTask = { ...this.form.getRawValue(), assignee };
    this.taskCreated.emit(task);
  }
}
