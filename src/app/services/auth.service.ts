import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { AuthState, LoginRequest, LoginResponse } from '../models/auth.models';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/auth`;
  private tokenExpirationTimer: ReturnType<typeof setTimeout> | null = null;

  /**
   * authStateSubject is an instance of BehaviorSubject that holds the authentication
   * state of the application. It emits the current authentication state and allows
   * subscribers to react to authentication changes.
   *
   * The authentication state includes:
   * - isAuthenticated: A boolean indicating whether the user is authenticated.
   * - username: A string representing the username of the authenticated user, or null if not authenticated.
   * - token: A string containing the authentication token, or null if not authenticated.
   * - expiresAt: A timestamp indicating when the authentication token expires, or null if not authenticated.
   *
   * This BehaviorSubject is initialized with a default state where the user is not authenticated.
   */
  private authStateSubject = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    username: null,
    token: null,
    expiresAt: null
  });

  /**
   * Represents an observable stream of the authentication state.
   * Emits values based on the current authentication state of the user.
   * Can be used to subscribe and react to changes in user authentication status.
   * Exposed as Observable so components cannot directly modify
   */
  public authState$ = this.authStateSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // check for saved token when services initialize
    this.loadAuthState();
  }

  /**
   * Retrieves the current authentication state.
   *
   * @return {AuthState} The current state of authentication.
   */
  get authState(): AuthState {
    return this.authStateSubject.value;
  }

  // get the current token
  get token(): string | null{
    return this.authState.token;
  }

  // check if the user is authenticated
  get isAuthenticated(): boolean {
    const currentState = this.authStateSubject.value;
    const valid = currentState.isAuthenticated &&
      !!currentState.token &&
      !!currentState.expiresAt &&
      currentState.expiresAt > Date.now();

    return valid;
  }

  /**
   * Authenticates the user by sending login credentials to the server.
   *
   * @param {LoginRequest} credentials - The login details of the user including username
   * and password.
   * @return {Observable<LoginResponse>} An observable emitting the server's response after
   * a successful login or an error if the login fails.
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          this.handleLoginSuccess(response);
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Login Failed'));
        })
      );
  }

  /**
   * Logs out the current user by clearing the authentication state, removing stored
   * authentication data, and redirecting to the login page.
   *
   * @return {void} No value is returned from this method.
   */
  logout(): void {
    // clear the timeout (if it exists)
    if(this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }

    // update auth state
    this.authStateSubject.next({
      isAuthenticated: false,
      username: null,
      token: null,
      expiresAt: null
    });

    // clear local storage
    localStorage.removeItem('auth_data');

    // redirect to log in
    const currentUrl = this.router.url;

    // Prevent login loops by not setting returnUrl if current URL is login or contains login
    // if (currentUrl === '/login' || currentUrl.includes('/login')) {
    //   this.router.navigate(['/home']);
    // } else {
    //   this.router.navigate(['/login'], {
    //     queryParams: { returnUrl: currentUrl }
    //   });
    // }
    this.router.navigate(['/home']);
  }

  /**
   * Loads the authentication state from localStorage if available and valid.
   * Parses the stored authentication data, validates the token expiration,
   * and updates the authentication state accordingly. If the token is expired
   * or the data is invalid, it triggers a logout and clears the stored data.
   *
   * @return {void} No return value, as this method updates state or performs side effects.
   */
  private loadAuthState(): void {
    const storedData = localStorage.getItem('auth_data');

    if(!storedData) {
      return;
    }

    try{
      const authData = JSON.parse(storedData);

      // check if the token is expired
      if(authData.expiresAt && authData.expiresAt > Date.now()){
        this.authStateSubject.next({
          isAuthenticated: true,
          username: authData.username,
          token: authData.token,
          expiresAt: authData.expiresAt
        });

        // set the auto-logout timer
        this.autoLogout(authData.expiresAt - Date.now());
      } else {
        // token has expired, clear it
        this.logout();
      }
    } catch(e) {
      console.error('Error parsing stored auth data:', e);
      localStorage.removeItem('auth_data');
    }
  }

  /**
   * Handles the successful login process by updating the authentication state,
   * saving data to local storage, and setting an auto-logout timer.
   *
   * @param {LoginResponse} response The response object containing authentication details,
   * including access token, username, and expiration time in seconds.
   * @return {void} Does not return a value.
   */
  private handleLoginSuccess(response: LoginResponse): void {
    // Calculate expiration time based on expiresIn value
    // expiresIn could be a date string or a duration in seconds
    let expiresAt: number;

    // if (isNaN(Number(response.expiresIn))) {
    //   // If it's not a number, treat it as a date string
    //   expiresAt = new Date(response.expiresIn).getTime();
    // } else {
    //   // If it's a number, treat it as seconds from now
    //   expiresAt = Date.now() + Number(response.expiresIn) * 1000;
    // }
    // Option 1: If expiresIn is seconds from now (common format)
    if (typeof response.expiresIn === 'number') {
      expiresAt = Date.now() + (response.expiresIn * 1000); // Convert seconds to milliseconds
    }
    // Option 2: If expiresIn is an ISO date string
    else if (typeof response.expiresIn === 'string' && response.expiresIn.includes('T')) {
      expiresAt = new Date(response.expiresIn).getTime();
    }
    // Option 3: If expiresIn is a timestamp
    else if (!isNaN(Number(response.expiresIn))) {
      expiresAt = Number(response.expiresIn);
    }  // Fallback with debugging
    else {
      console.error('Unexpected expiresIn format:', response.expiresIn, typeof response.expiresIn);
      // Set a default expiration (e.g., 1 hour)
      expiresAt = Date.now() + (3600 * 1000);
    }
    console.log('Token expiration calculation:', {
      expiresIn: response.expiresIn,
      calculatedExpiresAt: expiresAt,
      humanReadable: new Date(expiresAt).toLocaleString(),
      millisUntilExpiry: expiresAt - Date.now()
    });

    // create the auth state
    const authState: AuthState = {
      isAuthenticated: true,
      token: response.token,
      username: response.userName,
      expiresAt: expiresAt
    };

    // update state
    this.authStateSubject.next(authState);

    // save to local storage
    localStorage.setItem('auth_data', JSON.stringify(authState));

    // set the auto-logout timer
    const timeUntilExpiry = expiresAt - Date.now();
    this.autoLogout(timeUntilExpiry);

  }

  /**
   * Sets up an automatic logout timer that will trigger when the token expires.
   *
   * @param {number} expiresInMs The time in milliseconds until the token expires.
   * @return {void} Does not return a value.
   */
  private autoLogout(expiresInMs: number): void {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }

    this.tokenExpirationTimer = setTimeout(() => {
     // this.logout();
    }, expiresInMs);
  }
}
