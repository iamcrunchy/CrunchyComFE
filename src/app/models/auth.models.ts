/**
 * Represents the login request data sent to the authentication API.
 */
export interface LoginRequest {
  /** User's email address */
  email: string;
  /** User's password */
  password: string;
}

/**
 * Represents the response from the authentication API after a successful login.
 */
export interface LoginResponse {
  /** JWT authentication token */
  token: string;
  /** Token expiration time (can be a date string or duration in seconds) */
  expiresIn: string;
  /** The authenticated user's username */
  userName: string;
}

/**
 * Represents the authentication state maintained by the application.
 */
export interface AuthState {
  /** Whether the user is currently authenticated */
  isAuthenticated: boolean;
  /** The authenticated user's username, or null if not authenticated */
  username: string | null;
  /** The authentication token, or null if not authenticated */
  token: string | null;
  /** Timestamp when the token expires, or null if not authenticated */
  expiresAt: number | null;
}
