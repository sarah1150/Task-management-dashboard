/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

import { SideBarComponent } from './side-bar.component';
import { selectUsers } from '../../store/selectors/tasks.selectors';
import { ModalService } from '../../shared/service/modal.service';
import { Assignee } from '../../features/dashboard/models/assignee';

describe('SideBarComponent', () => {
  let component: SideBarComponent;
  let fixture: ComponentFixture<SideBarComponent>;
  let store: MockStore;
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
      avatar: 'Svg',
      email: 'john@company.com',
    },
  ] as Assignee[];

  beforeEach(async () => {
    modalService = jasmine.createSpyObj('ModalService', ['openCreate']);

    await TestBed.configureTestingModule({
      imports: [SideBarComponent],
      providers: [
        provideMockStore(),
        {
          provide: ModalService,
          useValue: modalService,
        },
      ],
    })
      .overrideComponent(SideBarComponent, {
        set: { template: '', imports: [] },
      })
      .compileComponents();

    store = TestBed.inject(MockStore);

    store.overrideSelector(selectUsers, mockUsers);

    fixture = TestBed.createComponent(SideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should get users from the store', () => {
    expect(component.users()).toEqual(mockUsers);
  });

  it('should call openCreate with users from the store', () => {
    component.openCreateModal();

    expect(modalService.openCreate).toHaveBeenCalledTimes(1);
    expect(modalService.openCreate).toHaveBeenCalledWith(mockUsers);
  });

  it('should initialize navigation items correctly', () => {
    expect(component.navigation.length).toBe(6);

    expect(component.navigation).toEqual([
      { label: 'Dashboard', route: '/', icon: 'dashboard.svg' },
      { label: 'Tasks', route: '/', icon: 'task.svg' },
      { label: 'Calendar', route: '/', icon: 'calendar.svg' },
      { label: 'Analytics', route: '/', icon: 'analytics.svg' },
      { label: 'Team', route: '/', icon: 'team.svg' },
      { label: 'Settings', route: '/', icon: 'settings.svg' },
    ]);
  });
});
