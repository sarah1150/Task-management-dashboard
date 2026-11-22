import { Component, inject } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../shared/material.imports';
import { Store } from '@ngrx/store';
import { setTaskFilters } from '../../store/actions/tasks.actions';
import { selectTaskFilters } from '../../store/selectors/tasks.selectors';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [...MATERIAL_IMPORTS],
})
export class NavbarComponent {
  private readonly store = inject(Store);
  private readonly filters = this.store.selectSignal(selectTaskFilters);

  updateSearch(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.store.dispatch(setTaskFilters({ filters: { query } }));
  }

  currentQuery(): string {
    return this.filters().query;
  }
}
