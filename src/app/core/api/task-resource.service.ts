import { httpResource } from '@angular/common/http';
import { Injectable, Injector, inject, runInInjectionContext } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Observable, filter, mergeMap, of, take, throwError } from 'rxjs';
import { Task } from '../../features/dashboard/models/task';
import { Statistic } from '../../features/dashboard/models/statistic';
import { Assignee } from '../../features/dashboard/models/assignee';

@Injectable({ providedIn: 'root' })

/** Service for managing fetching and reactive request state
 *  if data does not change it keep the response data , loading state and error state
 * if data changes it fetches the new data */
export class TaskResourceService {
  private readonly injector = inject(Injector);

  getTasks(): Observable<Task[]> {
    return this.getResource('/api/tasks', []).pipe(
      mergeMap((tasks) => of(tasks.map((task) => this.refineTaskObj(task)))),
    );
  }

  getUsers(): Observable<Assignee[]> {
    return this.getResource('/api/users', []);
  }

  getStatistics(): Observable<Statistic[]> {
    return this.getResource('/api/statistics', []);
  }

  private getResource<T>(url: string, defaultValue: T): Observable<T> {
    return new Observable<T>((subscriber) => {
      const resource = runInInjectionContext(this.injector, () =>
        httpResource<T>(() => url, { defaultValue, debugName: url }),
      );
      const subscription = toObservable(resource.status, { injector: this.injector })
        .pipe(
          filter((status) => status === 'resolved' || status === 'error'),
          take(1),
          mergeMap((status) =>
            status === 'error'
              ? throwError(() => resource.error() ?? new Error(`Request failed: ${url}`))
              : of(resource.value()),
          ),
        )
        .subscribe(subscriber);
      return () => {
        subscription.unsubscribe();
        resource.destroy();
      };
    });
  }

  private refineTaskObj(task: Task): Task {
    const today = new Date().toISOString().slice(0, 10);
    return {
      ...task,
      isOverdue: task.status !== 'done' && task.dueDate < today,
      completedAt: task.completedAt ?? null,
      order: task.order ?? 0,
      updatedAt: task.updatedAt ?? new Date().toISOString(),
    };
  }
}
