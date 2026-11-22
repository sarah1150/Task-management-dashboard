import { Component, computed, inject } from '@angular/core';
import { DashboardPageComponent } from '../../components/dashboard-page/dashboard-page.component';
import { StatisticsCardComponent } from '../../components/statistics-card/statistics-card.component';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
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

@Component({
  selector: 'app-dashboard-container',
  templateUrl: './dashboard-container.component.html',
  styleUrls: ['./dashboard-container.component.css'],
  imports: [DashboardPageComponent, StatisticsCardComponent, MatIconModule],
})
export class DashboardContainerComponent {
  private readonly store = inject(Store);
  readonly statistics = this.store.selectSignal(selectStatistics);
  private readonly statisticsError = this.store.selectSignal(selectStatisticsError);
  private readonly tasksError = this.store.selectSignal(selectTasksError);
  readonly tasks = this.store.selectSignal(selectFilteredTasks);
  readonly allTasks = this.store.selectSignal(selectTasks);
  readonly loading = this.store.selectSignal(selectTasksLoading);
  readonly filters = this.store.selectSignal(selectTaskFilters);
  readonly users = this.store.selectSignal(selectUsers);
  readonly today = new Date();
  readonly error = computed(() => this.tasksError() ?? this.statisticsError());

  /* refine all selectors results into an Input Obj to collect all data needed in child */
  readonly dashboardData = computed(() => ({
    tasks: this.tasks(),
    allTasks: this.allTasks(),
    loading: this.loading(),
    filters: this.filters(),
    users: this.users(),
  }));

  retryLoad(): void {
    this.store.dispatch(TaskActions.loadTasks({ force: true }));
    this.store.dispatch(TaskActions.loadStatistics({ force: true }));
  }
}
