import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { App } from './app';
import { loadStatistics, loadTasks, loadUsers } from './store/actions/tasks.actions';

describe('App', () => {
  let fixture: ComponentFixture<App>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideMockStore()],
    }).compileComponents();

    store = TestBed.inject(MockStore);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(App);
  });

  it('should create the app', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should dispatch loadTasks on initialization', () => {
    expect(store.dispatch).toHaveBeenCalledWith(loadTasks({}));
  });

  it('should dispatch loadUsers on initialization', () => {
    expect(store.dispatch).toHaveBeenCalledWith(loadUsers({}));
  });

  it('should dispatch loadStatistics on initialization', () => {
    expect(store.dispatch).toHaveBeenCalledWith(loadStatistics({}));
  });

  it('should dispatch all three actions on initialization', () => {
    expect(store.dispatch).toHaveBeenCalledTimes(3);
  });
});
