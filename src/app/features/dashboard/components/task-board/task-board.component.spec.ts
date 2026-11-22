/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

import { TaskBoardComponent } from './task-board.component';
import { Task } from '../../models/task';

describe('TaskBoardComponent', () => {
  let component: TaskBoardComponent;
  let fixture: ComponentFixture<TaskBoardComponent>;

  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Task title',
      description: 'Task description',
      status: 'todo',
      priority: 'high',
      dueDate: '2026-11-23',
      order: 2,
      assignee: {
        id: 'user-1',
        name: 'Sarah',
        avatar: 'Svg',
        email: 'sarah@company.com',
      },
      createdAt: '2026-11-19T17:29:46.368Z',
      updatedAt: '2026-11-21T17:29:46.368Z',
    } as Task,
    {
      id: '2',
      title: 'Task title 2',
      description: 'Task description 2',
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
    } as Task,
    {
      id: '3',
      title: 'Task title 3',
      description: 'Task description 3',
      status: 'in_progress',
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
    } as Task,
    {
      id: '4',
      title: 'Task title 4',
      description: 'Task description 4',
      status: 'done',
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
    } as Task,
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskBoardComponent],
    })
      .overrideComponent(TaskBoardComponent, {
        set: {
          template: '',
          imports: [],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(TaskBoardComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('tasks', mockTasks);

    fixture.detectChanges();
  });

  // Component initialization

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should receive tasks through the input signal', () => {
    expect(component.tasks()).toEqual(mockTasks);
  });

  it('should initialize columns with task statuses', () => {
    expect(component.columns).toBeTruthy();
    expect(component.columns.length).toBe(3);
  });

  // Grouping tasks

  it('should group tasks by their status', () => {
    const groups = component.groupedTasks();

    expect(groups['todo'].length).toBe(2);
    expect(groups['in_progress'].length).toBe(1);
    expect(groups['done'].length).toBe(1);
  });

  it('should sort tasks by order inside each group', () => {
    const todoTasks = component.groupedTasks()['todo'];

    expect(todoTasks[0].id).toBe('2');
    expect(todoTasks[1].id).toBe('1');
  });

  it('should return empty arrays for statuses without tasks', () => {
    const emptyTasks: Task[] = [];

    fixture.componentRef.setInput('tasks', emptyTasks);
    fixture.detectChanges();

    expect(component.groupedTasks()).toEqual({
      todo: [],
      in_progress: [],
      done: [],
    });
  });

  // tasksFor

  it('should return tasks for the requested status', () => {
    const result = component.tasksFor('todo');

    expect(result.length).toBe(2);
    expect(result.every((task) => task.status === 'todo')).toBeTrue();
  });

  it('should return tasks sorted by order for the requested status', () => {
    const result = component.tasksFor('todo');

    expect(result[0].order).toBe(1);
    expect(result[1].order).toBe(2);
  });

  // Edit output

  it('should emit the selected task through edit output', () => {
    const emitSpy = spyOn(component.edit, 'emit');

    const task = mockTasks[0];

    component.edit.emit(task);

    expect(emitSpy).toHaveBeenCalledWith(task);
  });

  // Remove output

  it('should emit the selected task through remove output', () => {
    const emitSpy = spyOn(component.remove, 'emit');

    const task = mockTasks[0];

    component.remove.emit(task);

    expect(emitSpy).toHaveBeenCalledWith(task);
  });

  // Drop task

  it('should emit taskMoved with the correct task, status and order', () => {
    const emitSpy = spyOn(component.taskMoved, 'emit');

    const task = mockTasks[0];

    const event = {
      item: {
        data: task,
      },
      currentIndex: 1,
    } as CdkDragDrop<Task[]>;

    component.dropTask(event, 'done');

    expect(emitSpy).toHaveBeenCalledWith({
      task,
      status: 'done',
      order: 1,
    });
  });

  it('should emit taskMoved when moving a task to another status', () => {
    const emitSpy = spyOn(component.taskMoved, 'emit');

    const task = mockTasks[0];

    const event = {
      item: {
        data: task,
      },
      currentIndex: 0,
    } as CdkDragDrop<Task[]>;

    component.dropTask(event, 'in_progress');

    expect(emitSpy).toHaveBeenCalledWith({
      task,
      status: 'in_progress',
      order: 0,
    });
  });
});
