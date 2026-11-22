/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

import { NavbarComponent } from './navbar.component';
import { selectTaskFilters } from '../../store/selectors/tasks.selectors';
import { setTaskFilters } from '../../store/actions/tasks.actions';
import { TaskFilters } from '../../features/dashboard/models/task-filters';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let store: MockStore;

  const mockFilters = {
    status: 'all',
    priority: 'all',
    query: '',
  } as TaskFilters;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [provideMockStore()],
    })
      .overrideComponent(NavbarComponent, {
        set: { template: '', imports: [] },
      })
      .compileComponents();

    store = TestBed.inject(MockStore);

    store.overrideSelector(selectTaskFilters, mockFilters);

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should return the current search query', () => {
    expect(component.currentQuery()).toBe('');
  });

  it('should return the updated search query from the store', () => {
    store.overrideSelector(selectTaskFilters, {
      ...mockFilters,
      query: 'Angular',
    });
    store.refreshState();

    expect(component.currentQuery()).toBe('Angular');
  });

  it('should dispatch setTaskFilters with the search query', () => {
    const dispatchSpy = spyOn(store, 'dispatch');

    const event = {
      target: {
        value: 'Angular',
      },
    } as unknown as Event;

    component.updateSearch(event);

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith(
      setTaskFilters({
        filters: {
          query: 'Angular',
        },
      }),
    );
  });

  it('should dispatch an empty query when the search is cleared', () => {
    const dispatchSpy = spyOn(store, 'dispatch');

    const event = {
      target: {
        value: '',
      },
    } as unknown as Event;

    component.updateSearch(event);

    expect(dispatchSpy).toHaveBeenCalledWith(
      setTaskFilters({
        filters: {
          query: '',
        },
      }),
    );
  });
});
