// Progress API types

export interface ProgressUser {
  id: string;
  email: string;
  username: string;
  name: string;
}

export type ActivityType = "tutorial" | "game";

// Backward compatibility alias
export type ProgressType = ActivityType;

export type ProgressCategory =
  | "how_to_move"
  | "how_to_play"
  | "mate-in-one"
  | "mate-in-two"
  | "basic-tactics"
  | "labyrinth";

export interface Progress {
  id: string;
  user: ProgressUser;
  type: ActivityType;
  category: ProgressCategory;
  completed: string[];
}

// Request types for creating/updating progress
export interface CreateProgressRequest {
  userId: string;
  type: ActivityType;
  category: ProgressCategory;
  completed: string[];
}

export interface UpdateProgressRequest {
  type: ActivityType;
  category: ProgressCategory;
  completed: string[];
}

// Response types
export type ProgressListResponse = Progress[];
export type ProgressResponse = Progress;
