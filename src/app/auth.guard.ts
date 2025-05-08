import { Injectable } from '@angular/core';
import { AuthService } from './services/auth.service';
import {CanActivate, Router, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate{
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  /**
   * Determines whether the route can be activated based on authentication status.
   * If the user is authenticated, allows access to the route.
   * Otherwise, redirects the user to the login page.
   *
   * @return {Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree} Returns true or a UrlTree to allow activation, or redirects to the login UrlTree if unauthenticated.
   */
  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree  {
    if(this.authService.isAuthenticated){
      return true;
    }
    return this.router.createUrlTree(['/login']);
  }
}
