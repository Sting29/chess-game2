import { User } from "../user/types";

// Authentication request types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

// Authentication response types
export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  session_id: string;
  user: User;
}
