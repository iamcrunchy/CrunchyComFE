import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpInterceptorFn,
  HttpRequest
} from '@angular/common/http';
import {Injectable} from '@angular/core';
import { AuthService } from '../services/auth.service';
import {Router} from '@angular/router';
import {catchError, Observable, throwError} from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router
  ){}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // get the auth token
    const token = this.authService.token;

    // if token exists, clone the request and add teh auth header
    if(token){
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // pass the request to the next handler
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // handle unauthorized errors (401: expired token, etc.)
        if(error.status === 401){
          this.authService.logout();
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}
