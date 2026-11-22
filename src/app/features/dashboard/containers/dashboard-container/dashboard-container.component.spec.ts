/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

import { DashboardContainerComponent } from './dashboard-container.component';
import {
  selectFilteredTasks,
  selectStatistics,
  selectStatisticsError,
  selectTaskFilters,
  selectTasks,
  selectTasksError,
  selectTasksLoading,
  selectUsers,
} from '../../../../store/selectors/tasks.selectors';
import * as TaskActions from '../../../../store/actions/tasks.actions';
import { Task } from '../../models/task';
import { Assignee } from '../../models/assignee';
import { Statistic } from '../../models/statistic';
import { TaskFilters } from '../../models/task-filters';

describe('DashboardContainerComponent', () => {
  let component: DashboardContainerComponent;
  let fixture: ComponentFixture<DashboardContainerComponent>;
  let store: MockStore;

  const mockTasks = [
    { id: '1', title: 'Task 1', status: 'todo' },
    { id: '2', title: 'Task 2', status: 'done' },
  ] as Task[];

  const mockStatistics = [
    {
      id: 'stat-002',
      title: 'Completed',
      icon: '✅',
      value: 89,
      change: '+8',
      changeLabel: 'today',
      changeType: 'positive',
      color: '#388E3C',
    },
  ] as Statistic[];

  const mockFilters = {
    query: '',
    status: 'all',
    priority: 'all',
  } as TaskFilters;

  const mockUsers = [
    {
      id: 'user-1',
      name: 'Sarah',
      avatar: 'Svg',
      email: 'sarah@company.com',
    },
  ] as Assignee[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardContainerComponent],
      providers: [provideMockStore()],
    })
      .overrideComponent(DashboardContainerComponent, {
        set: { template: '', imports: [] },
      })
      .compileComponents();

    store = TestBed.inject(MockStore);

    // Set mock selector values
    store.overrideSelector(selectStatistics, mockStatistics);
    store.overrideSelector(selectStatisticsError, null);
    store.overrideSelector(selectTasksError, null);
    store.overrideSelector(selectFilteredTasks, mockTasks);
    store.overrideSelector(selectTasks, mockTasks);
    store.overrideSelector(selectTasksLoading, false);
    store.overrideSelector(selectTaskFilters, mockFilters);
    store.overrideSelector(selectUsers, mockUsers);

    fixture = TestBed.createComponent(DashboardContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should get statistics from the store', () => {
    expect(component.statistics()).toEqual(mockStatistics);
  });

  it('should get filtered tasks from the store', () => {
    expect(component.tasks()).toEqual(mockTasks);
  });

  it('should get all tasks from the store', () => {
    expect(component.allTasks()).toEqual(mockTasks);
  });

  it('should get loading state from the store', () => {
    expect(component.loading()).toBeFalse();
  });

  it('should get filters from the store', () => {
    expect(component.filters()).toEqual(mockFilters);
  });

  it('should get users from the store', () => {
    expect(component.users()).toEqual(mockUsers);
  });

  it('should return tasks error when it exists', () => {
    store.overrideSelector(selectTasksError, 'Tasks loading failed');
    store.refreshState();

    expect(component.error()).toBe('Tasks loading failed');
  });

  it('should return statistics error when tasks error is null', () => {
    store.overrideSelector(selectStatisticsError, 'Statistics loading failed');
    store.refreshState();

    expect(component.error()).toBe('Statistics loading failed');
  });

  it('should prioritize tasks error when both errors exist', () => {
    store.overrideSelector(selectTasksError, 'Tasks loading failed');
    store.overrideSelector(selectStatisticsError, 'Statistics loading failed');
    store.refreshState();

    expect(component.error()).toBe('Tasks loading failed');
  });

  it('should return null when there are no errors', () => {
    expect(component.error()).toBeNull();
  });

  it('should combine selector values into dashboardData', () => {
    expect(component.dashboardData()).toEqual({
      tasks: mockTasks,
      allTasks: mockTasks,
      loading: false,
      filters: mockFilters,
      users: mockUsers,
    });
  });

  it('should dispatch loadTasks and loadStatistics when retryLoad is called', () => {
    const dispatchSpy = spyOn(store, 'dispatch');

    component.retryLoad();

    expect(dispatchSpy).toHaveBeenCalledTimes(2);
    expect(dispatchSpy).toHaveBeenCalledWith(TaskActions.loadTasks({ force: true }));
    expect(dispatchSpy).toHaveBeenCalledWith(TaskActions.loadStatistics({ force: true }));
  });
});
