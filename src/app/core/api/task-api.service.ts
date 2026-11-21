import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { concatMap, from, map, Observable, of, toArray } from 'rxjs';
import { Task } from '../../features/tasks/models/task';
import { TaskStatus } from '../../features/tasks/types/task-status';
import { CreateTask } from '../../features/tasks/types/create-task';

@Injectable({ providedIn: 'root' })
export class TaskApiService {
  private readonly http = inject(HttpClient);

  createTask(createdTask: CreateTask): Observable<Task> {
    const now = new Date().toISOString();
    const task: Task = {
      id: `task-${crypto.randomUUID()}`,
      isOverdue: createdTask.status !== TaskStatus.DONE && createdTask.dueDate < now,
      completedAt: createdTask.status === TaskStatus.DONE ? now : null,
      order: -Date.now(),
      createdAt: now,
      updatedAt: now,
      ...createdTask,
    };
    return this.http.post<Task>('/api/tasks', task).pipe(map(this.remakeTask));
  }

  updateTask(id: string, changes: Partial<CreateTask>): Observable<Task> {
    const payload: Partial<Task> = { ...changes, updatedAt: new Date().toISOString() };
    if (changes.status !== undefined) {
      payload.completedAt = changes.status === TaskStatus.DONE ? new Date().toISOString() : null;
    }
    return this.http.patch<Task>(`/api/tasks/${id}`, payload).pipe(map(this.remakeTask));
  }

  moveTask(
    id: string,
    status: TaskStatus,
    order: number,
    currentTasks: Task[],
  ): Observable<Task[]> {
    const current = currentTasks.find((task) => task.id === id);
    if (!current) throw new Error(`Task ${id} was not found in the NgRx cache.`);

    const now = new Date().toISOString();
    const sourceTasks = currentTasks
      .filter((task) => task.status === current.status && task.id !== id)
      .sort((left, right) => left.order - right.order);
    const targetTasks =
      status === current.status
        ? [...sourceTasks]
        : currentTasks
            .filter((task) => task.status === status && task.id !== id)
            .sort((left, right) => left.order - right.order);
    targetTasks.splice(Math.max(0, Math.min(order, targetTasks.length)), 0, {
      ...current,
      status,
    });

    const plans = targetTasks.map((task, index) => ({ task, status: task.status, order: index }));
    if (status !== current.status) {
      plans.push(
        ...sourceTasks.map((task, index) => ({ task, status: task.status, order: index })),
      );
    }

    const changedPlans = plans.filter(
      ({ task, status: nextStatus, order: nextOrder }) =>
        task.id === id || task.status !== nextStatus || task.order !== nextOrder,
    );
    if (!changedPlans.length) return of([current]);

    return from(changedPlans).pipe(
      concatMap(({ task, status: nextStatus, order: nextOrder }) =>
        this.http
          .patch<Task>(`/api/tasks/${task.id}`, {
            status: nextStatus,
            order: nextOrder,
            completedAt:
              task.id === id
                ? status === TaskStatus.DONE
                  ? (current.completedAt ?? now)
                  : null
                : task.completedAt,
            updatedAt: now,
          })
          .pipe(map(this.remakeTask)),
      ),
      toArray(),
    );
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`/api/tasks/${id}`);
  }

  private remakeTask(task: Task): Task {
    const now = new Date().toISOString();
    return {
      ...task,
      isOverdue: task.status !== TaskStatus.DONE && task.dueDate < now,
      completedAt: task.completedAt ?? null,
      order: task.order ?? 0,
      updatedAt: task.updatedAt ?? new Date().toISOString(),
    };
  }
}
