import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../../shared/material.imports';
import { Task } from '../../models/task';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, ...MATERIAL_IMPORTS],
})
export class TaskCardComponent {
  readonly task = input.required<Task>();
  readonly edit = output<Task>();
  readonly remove = output<Task>();
}
