import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { TaskApiService } from '../../core/api/task-api.service';
import { HttpErrorResponse } from '@angular/common/http';
import * as TaskActions from '../actions/tasks.actions';
import { catchError, EMPTY, exhaustMap, map, mergeMap, of, startWith, switchMap, take } from 'rxjs';
import {
  selectStatisticsLoaded,
  selectTasks,
  selectTasksLoaded,
  selectUsersLoaded,
} from '../selectors/tasks.selectors';
import { TaskResourceService } from '../../core/api/task-resource.service';

function errorMessage(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    if (error.status === 0) return 'JSON Server could not be reached. Please retry.';
    const serverMessage =
      typeof error.error === 'object' && error.error !== null && 'message' in error.error
        ? String(error.error.message)
        : null;
    return serverMessage ?? `The request failed with HTTP ${error.status}.`;
  }
  return error instanceof Error ? error.message : 'The request could not be completed.';
}

@Injectable()
export class TasksEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(TaskApiService);
  private readonly store = inject(Store);
  private readonly resources = inject(TaskResourceService);

  /** NgRx is the read cache: a collection already loaded in state avoids another HTTP request. */
  readonly loadTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.loadTasks),
      exhaustMap(({ force }) =>
        this.store.select(selectTasksLoaded).pipe(
          take(1),
          switchMap((loaded) => {
            if (loaded && !force) return EMPTY;
            return this.resources.getTasks().pipe(
              map((tasks) => TaskActions.tasksLoaded({ tasks })),
              catchError((error: unknown) =>
                of(TaskActions.tasksLoadFailed({ message: errorMessage(error) })),
              ),
              startWith(TaskActions.tasksLoadStarted()),
            );
          }),
        ),
      ),
    ),
  );

  readonly loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.loadUsers),
      exhaustMap(({ force }) =>
        this.store.select(selectUsersLoaded).pipe(
          take(1),
          switchMap((loaded) => {
            if (loaded && !force) return EMPTY;
            return this.resources.getUsers().pipe(
              map((users) => TaskActions.usersLoaded({ users })),
              catchError((error: unknown) =>
                of(TaskActions.usersLoadFailed({ message: errorMessage(error) })),
              ),
              startWith(TaskActions.usersLoadStarted()),
            );
          }),
        ),
      ),
    ),
  );

  readonly loadStatistics$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.loadStatistics),
      exhaustMap(({ force }) =>
        this.store.select(selectStatisticsLoaded).pipe(
          take(1),
          switchMap((loaded) => {
            if (loaded && !force) return EMPTY;
            return this.resources.getStatistics().pipe(
              map((statistics) => TaskActions.statisticsLoaded({ statistics })),
              catchError((error: unknown) =>
                of(TaskActions.statisticsLoadFailed({ message: errorMessage(error) })),
              ),
              startWith(TaskActions.statisticsLoadStarted()),
            );
          }),
        ),
      ),
    ),
  );

  readonly createTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.createTask),
      mergeMap(({ draft }) =>
        this.api.createTask(draft).pipe(
          map((task) => TaskActions.createTaskSucceeded({ task })),
          catchError((error: unknown) =>
            of(TaskActions.createTaskFailed({ message: errorMessage(error) })),
          ),
        ),
      ),
    ),
  );

  readonly updateTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.updateTask),
      mergeMap(({ id, changes }) =>
        this.api.updateTask(id, changes).pipe(
          map((task) => TaskActions.updateTaskSucceeded({ task })),
          catchError((error: unknown) =>
            of(TaskActions.updateTaskFailed({ message: errorMessage(error) })),
          ),
        ),
      ),
    ),
  );

  readonly moveTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.moveTask),
      mergeMap(({ id, status, order }) =>
        this.store.select(selectTasks).pipe(
          take(1),
          switchMap((tasks) =>
            this.api.moveTask(id, status, order, tasks).pipe(
              map((reorderedTasks) =>
                TaskActions.moveTaskSucceeded({
                  task: reorderedTasks.find((task) => task.id === id)!,
                  reorderedTasks,
                }),
              ),
            ),
          ),
          catchError((error: unknown) =>
            of(TaskActions.moveTaskFailed({ message: errorMessage(error) })),
          ),
        ),
      ),
    ),
  );

  readonly deleteTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.deleteTask),
      mergeMap(({ task }) =>
        this.api.deleteTask(task.id).pipe(
          map(() => TaskActions.deleteTaskSucceeded({ task })),
          catchError((error: unknown) =>
            of(TaskActions.deleteTaskFailed({ message: errorMessage(error) })),
          ),
        ),
      ),
    ),
  );
}
