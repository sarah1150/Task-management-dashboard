/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { DashboardPageComponent } from './dashboard-page.component';
import { ModalService } from '../../../../shared/service/modal.service';
import * as TaskActions from '../../../../store/actions/tasks.actions';
import { Task } from '../../models/task';
import { TaskDropEvent } from '../../models/task-drop-event';
import { TasksPriority } from '../../types/task-priority';
import { TaskStatus } from '../../types/task-status';
import { DashboardData } from '../../models/dashboard-data';

describe('DashboardPageComponent', () => {
  let component: DashboardPageComponent;
  let fixture: ComponentFixture<DashboardPageComponent>;
  let store: MockStore;
  let dispatchSpy: jasmine.Spy;
  let modalService: jasmine.SpyObj<ModalService>;

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
      avatar: 'JD',
      email: 'john@company.com',
    },
  ] as DashboardData['users'];

  const mockTask = {
    id: 'task-1',
    title: 'Task title',
    description: 'Task description',
    status: 'todo',
    priority: 'high',
    dueDate: '2026-11-23',
    assignee: {
      id: 'user-1',
      name: 'Sarah',
      avatar: 'Svg',
      email: 'sarah@company.com',
    },
    createdAt: '2026-11-19T17:29:46.368Z',
    updatedAt: '2026-11-21T17:29:46.368Z',
  } as Task;

  const mockDashboardData = {
    users: mockUsers,
  } as DashboardData;

  beforeEach(async () => {
    modalService = jasmine.createSpyObj<ModalService>('ModalService', [
      'openCreate',
      'openEdit',
      'confirmDelete',
    ]);

    await TestBed.configureTestingModule({
      imports: [DashboardPageComponent],
      providers: [
        provideMockStore(),
        {
          provide: ModalService,
          useValue: modalService,
        },
      ],
    })
      .overrideComponent(DashboardPageComponent, {
        set: {
          template: '',
          imports: [],
        },
      })
      .compileComponents();

    store = TestBed.inject(MockStore);
    dispatchSpy = spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(DashboardPageComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('data', mockDashboardData);

    fixture.detectChanges();
  });

  // Component initialization
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize dashboard data', () => {
    expect(component.data()).toEqual(mockDashboardData);
  });

  // Status tabs
  it('should initialize all status tabs correctly', () => {
    expect(component.statusTabs).toEqual([
      { label: 'All tasks', value: 'all' },
      { label: 'To do', value: 'todo' },
      { label: 'In progress', value: 'in_progress' },
      { label: 'Done', value: 'done' },
    ]);
  });

  // Set status
  it('should dispatch setTaskFilters with all status', () => {
    component.setStatus('all');

    expect(dispatchSpy).toHaveBeenCalledWith(
      TaskActions.setTaskFilters({
        filters: { status: 'all' },
      }),
    );
  });

  it('should dispatch setTaskFilters with todo status', () => {
    component.setStatus('todo');

    expect(dispatchSpy).toHaveBeenCalledWith(
      TaskActions.setTaskFilters({
        filters: { status: 'todo' },
      }),
    );
  });

  it('should dispatch setTaskFilters with in_progress status', () => {
    component.setStatus('in_progress');

    expect(dispatchSpy).toHaveBeenCalledWith(
      TaskActions.setTaskFilters({
        filters: { status: 'in_progress' },
      }),
    );
  });

  it('should dispatch setTaskFilters with done status', () => {
    component.setStatus('done');

    expect(dispatchSpy).toHaveBeenCalledWith(
      TaskActions.setTaskFilters({
        filters: { status: 'done' },
      }),
    );
  });

  // Set priority
  it('should dispatch setTaskFilters with low priority', () => {
    component.setPriority('low' as TasksPriority);

    expect(dispatchSpy).toHaveBeenCalledWith(
      TaskActions.setTaskFilters({
        filters: { priority: 'low' },
      }),
    );
  });

  it('should dispatch setTaskFilters with medium priority', () => {
    component.setPriority('medium' as TasksPriority);

    expect(dispatchSpy).toHaveBeenCalledWith(
      TaskActions.setTaskFilters({
        filters: { priority: 'medium' },
      }),
    );
  });

  it('should dispatch setTaskFilters with high priority', () => {
    component.setPriority('high' as TasksPriority);

    expect(dispatchSpy).toHaveBeenCalledWith(
      TaskActions.setTaskFilters({
        filters: { priority: 'high' },
      }),
    );
  });

  // Create modal
  it('should open create modal with dashboard users', () => {
    component.openCreateModal();

    expect(modalService.openCreate).toHaveBeenCalledOnceWith(mockUsers);
  });

  // Edit modal
  it('should open edit modal with dashboard users and selected task', () => {
    component.openEditModal(mockTask);

    expect(modalService.openEdit).toHaveBeenCalledOnceWith(mockUsers, mockTask);
  });

  // Delete confirmation
  it('should open delete confirmation with selected task', () => {
    component.confirmDeleteTask(mockTask);

    expect(modalService.confirmDelete).toHaveBeenCalledOnceWith(mockTask);
  });

  // Move task
  it('should dispatch moveTask with the correct task information', () => {
    const event: TaskDropEvent = {
      task: mockTask,
      status: 'done' as TaskStatus,
      order: 2,
    };
    component.onTaskMoved(event);

    expect(dispatchSpy).toHaveBeenCalledWith(
      TaskActions.moveTask({
        id: mockTask.id,
        status: event.status,
        order: event.order,
      }),
    );
  });

  it('should dispatch moveTask when moving a task to another status', () => {
    const event: TaskDropEvent = {
      task: mockTask,
      status: 'in_progress' as TaskStatus,
      order: 0,
    };
    component.onTaskMoved(event);

    expect(dispatchSpy).toHaveBeenCalledWith(
      TaskActions.moveTask({
        id: mockTask.id,
        status: 'in_progress',
        order: 0,
      }),
    );
  });
});
