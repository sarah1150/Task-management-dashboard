import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { SideBarComponent } from './layout/side-bar/side-bar.component';
import { loadStatistics, loadTasks, loadUsers } from './store/actions/tasks.actions';
import { Store } from '@ngrx/store';
import { ModalService } from './shared/service/modal.service';

@Component({
  imports: [RouterOutlet, NavbarComponent, SideBarComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  private readonly store = inject(Store);
  protected readonly modalService = inject(ModalService);

  constructor() {
    this.store.dispatch(loadTasks({}));
    this.store.dispatch(loadUsers({}));
    this.store.dispatch(loadStatistics({}));
  }
}
