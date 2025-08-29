// Common API types

// Chess types
export enum ChessSet {
  Set1 = "chessSet1",
  Set2 = "chessSet2",
  Set3 = "chessSet3",
  Set4 = "chessSet4",
}

// User profile types
export type Gender = "male" | "female" | "prefer_not_to_say";
export type Avatar = "avatar1" | "avatar2" | "avatar3" | "avatar4";
export type Language = "he" | "en" | "ar" | "ru";
export type AvatarHat = "avatarHat1" | "avatarHat2";
export type AvatarWear = "avatarWear1" | "avatarWear2" | "avatarWear3";

export interface AvatarSelection {
  gender: Gender;
  avatar: Avatar;
}
