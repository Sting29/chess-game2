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

export type Gender = "male" | "female" | "prefer_not_to_say";
export type Avatar = "avatar1" | "avatar2" | "avatar3" | "avatar4";
export type Language = "he" | "en" | "ar" | "ru";
export type AvatarHat = "avatarHat1" | "avatarHat2";
export type AvatarWear = "avatarWear1" | "avatarWear2" | "avatarWear3";

export interface AvatarSelection {
  gender: Gender;
  avatar: Avatar;
}

export interface UserProfile {
  id: string;
  gender?: Gender;
  avatar?: Avatar;
  avatarHat?: AvatarHat;
  avatarWear?: AvatarWear;
  age?: number;
  language?: Language;
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

// Progress tracking types
export interface Progress {
  id: string;
  userId: string;
  sections: SectionProgress[];
  totalProgress: number; // общий прогресс в процентах
  lastUpdated: string;
}

export interface SectionProgress {
  sectionId: string;
  sectionType: ProgressSectionType;
  completed: boolean;
  items: ItemProgress[];
  progress: number; // прогресс секции в процентах
}

export interface ItemProgress {
  itemId: string;
  completed: boolean;
  attempts: number;
  bestScore?: number;
  completedAt?: string;
}

export enum ProgressSectionType {
  HowToMove = "howToMove",
  HowToPlay = "howToPlay",
  Puzzles = "puzzles",
  Lessons = "lessons",
}

export interface UpdateProgressRequest {
  sectionId: string;
  itemId: string;
  completed: boolean;
  score?: number;
}

// API Error types
export interface ApiErrorResponse {
  message: string;
  error?: string;
  statusCode?: number;
}
