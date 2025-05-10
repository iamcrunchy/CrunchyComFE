import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpRequest
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * Interceptor that adds authentication token to outgoing requests
 * and handles authentication-related error responses.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Add auth token to request if available and if it's going to our API
  const token = authService.token;
  const isApiRequest = req.url.startsWith(environment.apiUrl);

  if (token && isApiRequest) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Process the response
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle network connectivity issues
      if (error.status === 0) {
        return throwError(() => new Error('Network error. Please try again.'));
      }

      // Handle authentication errors
      if (error.status === 401) {
        authService.logout();
        router.navigate(['/login'], {
          queryParams: { returnUrl: router.url }
        });
        return throwError(() => new Error('Session expired. Please login again.'));
      }

      // Handle validation errors
      if (error.status === 400) {
        return throwError(() => new Error(error.error?.message || 'Invalid request. Please check your input.'));
      }

      // Handle all other errors
      return throwError(() => new Error(error.error?.message || 'An error occurred. Please try again.'));
    })
  );
};
