import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'create-task',
    title: 'Create Task',
    loadComponent: () =>
      import('./features/tasks/containers/create-task-container/create-task-container.component').then(
        (page) => page.CreateTaskContainerComponent,
      ),
  },
  { path: '**', redirectTo: '' },
];
