import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { retry, throwError, timer } from 'rxjs';

/** Retry transient GET failures twice; client errors remain visible to NgRx effects and the UI. */
export const retryTransientRequestsInterceptor: HttpInterceptorFn = (request, next) =>
  request.method !== 'GET'
    ? next(request)
    : next(request).pipe(
        retry({
          count: 2,
          delay: (error: HttpErrorResponse, attempt) =>
            error.status === 0 || error.status >= 500
              ? timer(attempt * 180)
              : throwError(() => error),
        }),
      );
