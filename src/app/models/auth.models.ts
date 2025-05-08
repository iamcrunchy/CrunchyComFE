export interface LoginRequest {
  name: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  expiresIn: number;
  userName: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
  token: string | null;
  expiresAt: number | null;
}
