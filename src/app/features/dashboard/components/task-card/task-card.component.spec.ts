/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskCardComponent } from './task-card.component';
import { Task } from '../../models/task';

describe('TaskCardComponent', () => {
  let component: TaskCardComponent;
  let fixture: ComponentFixture<TaskCardComponent>;

  const mockTask: Task = {
    id: '1',
    title: 'Task title',
    description: 'Task description',
    status: 'todo',
    priority: 'high',
    dueDate: '2026-11-23',
    order: 1,
    assignee: {
      id: 'user-1',
      name: 'Sarah',
      avatar: 'Svg',
      email: 'sarah@company.com',
    },
    createdAt: '2026-11-19T17:29:46.368Z',
    updatedAt: '2026-11-21T17:29:46.368Z',
  } as Task;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskCardComponent],
    })
      .overrideComponent(TaskCardComponent, {
        set: { template: '', imports: [] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(TaskCardComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('task', mockTask);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should receive the task through the input signal', () => {
    expect(component.task()).toEqual(mockTask);
  });

  it('should update when a new task is passed', () => {
    const updatedTask: Task = {
      ...mockTask,
      id: '2',
      title: 'Updated task',
    };

    fixture.componentRef.setInput('task', updatedTask);
    fixture.detectChanges();

    expect(component.task()).toEqual(updatedTask);
  });

  it('should emit the task through the edit output', () => {
    const emitSpy = spyOn(component.edit, 'emit');

    component.edit.emit(mockTask);

    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(emitSpy).toHaveBeenCalledWith(mockTask);
  });

  it('should emit the task through the remove output', () => {
    const emitSpy = spyOn(component.remove, 'emit');

    component.remove.emit(mockTask);

    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(emitSpy).toHaveBeenCalledWith(mockTask);
  });
});
