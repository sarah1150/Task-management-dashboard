/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TaskFormDialogComponent } from './task-form-dialog.component';
import { FormValidatorService } from '../../validator/form-validator.service';
import { TaskFormData } from '../../models/task-form-data';
import { TaskDraft } from '../../../features/dashboard/types/task-draft';
import { Assignee } from '../../../features/dashboard/models/assignee';

describe('TaskFormDialogComponent', () => {
  let component: TaskFormDialogComponent;
  let fixture: ComponentFixture<TaskFormDialogComponent>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<TaskFormDialogComponent, TaskDraft>>;

  const mockUsers = [
    {
      id: 'user-1',
      name: 'Sarah',
      avatar: 'Svg',
      email: 'sarah@company.com',
    },
    {
      id: 'user-2',
      name: 'John',
      avatar: 'Svg',
      email: 'john@company.com',
    },
  ] as Assignee[];

  const mockData: TaskFormData = {
    users: mockUsers,
    task: undefined,
  };

  // Mock custom validators
  const nonBlank: ValidatorFn = (control: AbstractControl) =>
    control.value?.trim() ? null : { nonBlank: true };

  const validatorServiceMock = {
    nonBlank,
    validDate: () => null,
    futureDate: () => null,
    todayInput: () => '2026-11-23',
  };

  beforeEach(async () => {
    dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [TaskFormDialogComponent],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: mockData,
        },
        {
          provide: MatDialogRef,
          useValue: dialogRef,
        },
        {
          provide: FormValidatorService,
          useValue: validatorServiceMock,
        },
      ],
    })
      .overrideComponent(TaskFormDialogComponent, {
        set: { template: '', imports: [] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(TaskFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should receive dialog data', () => {
    expect(component.data).toEqual(mockData);
  });

  it('should initialize the form with default values', () => {
    expect(component.form.getRawValue()).toEqual({
      title: '',
      description: '',
      priority: 'medium',
      status: 'todo',
      dueDate: '2026-11-23',
      assigneeId: 'user-1',
    });
  });

  it('should initialize priorities and statuses', () => {
    expect(component.priorities.length).toBeGreaterThan(0);
    expect(component.statuses.length).toBe(3);
  });

  it('should mark the form as invalid when required fields are empty', () => {
    expect(component.form.invalid).toBeTrue();
  });

  it('should mark the title as invalid when it contains only whitespace', () => {
    component.form.controls.title.setValue('   ');

    expect(component.form.controls.title.hasError('nonBlank')).toBeTrue();
  });

  it('should mark the description as invalid when it contains only whitespace', () => {
    component.form.controls.description.setValue('   ');

    expect(component.form.controls.description.hasError('nonBlank')).toBeTrue();
  });

  it('should mark the title as invalid when it exceeds 90 characters', () => {
    component.form.controls.title.setValue('a'.repeat(91));

    expect(component.form.controls.title.hasError('maxlength')).toBeTrue();
  });

  it('should mark the description as invalid when it exceeds 320 characters', () => {
    component.form.controls.description.setValue('a'.repeat(321));

    expect(component.form.controls.description.hasError('maxlength')).toBeTrue();
  });

  it('should mark all controls as touched when saving an invalid form', () => {
    component.save();

    expect(component.form.controls.title.touched).toBeTrue();
    expect(component.form.controls.description.touched).toBeTrue();
    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('should close the dialog with the correct task draft when the form is valid', () => {
    component.form.setValue({
      title: '  New task  ',
      description: '  Task description  ',
      priority: 'high',
      status: 'todo',
      dueDate: '2026-11-23',
      assigneeId: 'user-1',
    });

    component.save();

    expect(dialogRef.close).toHaveBeenCalledTimes(1);
    expect(dialogRef.close).toHaveBeenCalledWith({
      title: 'New task',
      description: 'Task description',
      priority: 'high',
      status: 'todo',
      dueDate: '2026-11-23',
      assignee: mockUsers[0],
    });
  });

  it('should not close the dialog when the selected assignee does not exist', () => {
    component.form.setValue({
      title: 'New task',
      description: 'Task description',
      priority: 'high',
      status: 'todo',
      dueDate: '2026-11-23',
      assigneeId: 'unknown-user',
    });

    component.save();

    expect(dialogRef.close).not.toHaveBeenCalled();
  });
});
