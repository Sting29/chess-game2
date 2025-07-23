// Authentication types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  session_id: string;
  user: User;
}

// Chess types
export enum ChessSet {
  Set1 = "chessSet1",
  Set2 = "chessSet2",
  Set3 = "chessSet3",
  Set4 = "chessSet4",
}

// User types
export interface User {
  id: string;
  email: string;
  username: string;
  name?: string;
  role: "admin" | "teacher" | "student";
  profile?: UserProfile;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  gender?: "male" | "female" | "other" | "prefer_not_to_say";
  avatar?: "avatar1" | "avatar2" | "avatar3";
  avatarHat?: "avatarHat1" | "avatarHat2";
  avatarWear?: "avatarWear1" | "avatarWear2" | "avatarWear3";
  age?: number;
  language?: "he" | "en" | "ar" | "ru";
  chessSet?: ChessSet;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileRequest {
  email?: string;
  username?: string;
  name?: string;
  profile?: Partial<UserProfile>;
}

// Session types
export interface UserSession {
  id: string;
  deviceInfo: string;
  ipAddress: string;
  location: string;
  isActive: boolean;
  lastActivity: string;
  createdAt: string;
  isCurrent: boolean;
}

// API Error types
export interface ApiErrorResponse {
  message: string;
  error?: string;
  statusCode?: number;
}
