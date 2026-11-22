/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ConfirmDialogComponent } from './confirm-dialog.component';
import { ConfirmDialogData } from '../../models/confirm-dialog-data';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;

  const mockDialogData: ConfirmDialogData = {
    title: 'Delete Task',
    message: 'Are you sure you want to delete this task?',
    confirmText: 'Delete',
    cancelText: 'Cancel',
  } as ConfirmDialogData;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: mockDialogData,
        },
      ],
    })
      .overrideComponent(ConfirmDialogComponent, {
        set: { template: '', imports: [] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should receive dialog data', () => {
    expect(component.data).toEqual(mockDialogData);
  });

  it('should receive the correct dialog title', () => {
    expect(component.data.title).toBe('Delete Task');
  });

  it('should receive the correct dialog message', () => {
    expect(component.data.message).toBe('Are you sure you want to delete this task?');
  });
});
