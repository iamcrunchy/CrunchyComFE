import { Injectable } from '@angular/core';
import { AuthService } from './services/auth.service';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

/**
 * Guard that protects routes requiring authentication.
 * Redirects to login page if user is not authenticated.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  /**
   * Determines if a route can be activated based on authentication status.
   *
   * @param route The route being activated
   * @param state The router state
   * @returns True if the user is authenticated, otherwise a UrlTree to the login page
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (this.authService.isAuthenticated) {
      return true;
    }

    // Store the attempted URL for redirecting after login
    return this.router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url }
    });
  }
}
