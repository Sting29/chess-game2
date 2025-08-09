// TypeScript interfaces for computer game functionality

export enum DifficultyId {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
  MASTER = "master",
}

export interface GameEngineSettings {
  skill: number; // Stockfish skill level (0-20): 0 = weakest, 20 = strongest
  depth: number; // Search depth (1-20): number of half-moves to analyze
  time: number; // Time per move in milliseconds
  MultiPV: number; // Number of best moves to analyze
  threads: number; // Number of threads for calculation
  kidsMode: boolean; // Kids mode with simplified logic and hints
}

export interface GameUISettings {
  showLastMoveArrow: boolean; // Show last move arrow
  showThreatHighlight: boolean; // Highlight threatened pieces (in kids mode)
  showMoveHints: boolean; // Show possible move hints
  enableSoundEffects: boolean; // Enable sound effects
}

export interface DifficultyLevel {
  id: DifficultyId;
  titleKey: string;
  description: string;
  ageGroupKey: string; // Translation key for age group
  featuresKey: string; // Translation key for features description
  image: string; // Chess piece image for UI
  widgetSize: "large"; // Widget size for UI components
  avatar: string; // Teacher avatar image
  engineSettings: GameEngineSettings;
  uiSettings: GameUISettings;
}
