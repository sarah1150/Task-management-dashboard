import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MATERIAL_IMPORTS } from '../../shared/material.imports';
import { NavigationItem } from '../models/navigation-item';
import { Store } from '@ngrx/store';
import { selectUsers } from '../../store/selectors/tasks.selectors';
import { ModalService } from '../../shared/service/modal.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [...MATERIAL_IMPORTS, RouterLink],
})
export class SideBarComponent {
  private readonly store = inject(Store);
  protected readonly modalService = inject(ModalService);
  readonly users = this.store.selectSignal(selectUsers);
  navigation: NavigationItem[] = [
    { label: 'Dashboard', route: '/', icon: 'dashboard.svg' },
    { label: 'Tasks', route: '/', icon: 'task.svg' },
    { label: 'Calendar', route: '/', icon: 'calendar.svg' },
    { label: 'Analytics', route: '/', icon: 'analytics.svg' },
    { label: 'Team', route: '/', icon: 'team.svg' },
    { label: 'Settings', route: '/', icon: 'settings.svg' },
  ];

  openCreateModal() {
    this.modalService.openCreate(this.users());
  }
}
