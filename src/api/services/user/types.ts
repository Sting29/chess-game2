import {
  Gender,
  Avatar,
  Language,
  AvatarHat,
  AvatarWear,
  ChessSet,
} from "../../types/common";

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
