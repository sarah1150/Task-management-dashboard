import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Dashboard',
    loadComponent: () =>
      import('./features/dashboard/containers/dashboard-container/dashboard-container.component').then(
        (page) => page.DashboardContainerComponent,
      ),
  },
  { path: '**', redirectTo: '' },
];
