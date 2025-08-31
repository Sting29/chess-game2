// Centralized image imports for PuzzleCategory
import backgroundPuzzle5 from "src/assets/background/puzzles/puzzle_5/background_puzzles_clear.png";
import trackPuzzle5 from "src/assets/background/puzzles/puzzle_5/track.png";
import backgroundPuzzle2 from "src/assets/background/puzzles/puzzle_2/background_puzzles_clear.png";
import trackPuzzle2 from "src/assets/background/puzzles/puzzle_2/track.png";

// Decorative elements
import anchor from "src/assets/background/puzzles/puzzle_5/anchor.png";
import bone from "src/assets/background/puzzles/puzzle_5/bone.png";
import coins from "src/assets/background/puzzles/puzzle_5/coins.png";
import map from "src/assets/background/puzzles/puzzle_5/map.png";
import stoneLeft from "src/assets/background/puzzles/puzzle_5/stone_left.png";
import stoneRight from "src/assets/background/puzzles/puzzle_5/stone_right.png";

import fish from "src/assets/background/puzzles/puzzle_2/fish.png";
import shell from "src/assets/background/puzzles/puzzle_2/shell.png";
import stone1 from "src/assets/background/puzzles/puzzle_2/stone_1.png";
import stone2 from "src/assets/background/puzzles/puzzle_2/stone_2.png";
import stumpLeft from "src/assets/background/puzzles/puzzle_2/stump_left.png";
import stumpRight from "src/assets/background/puzzles/puzzle_2/stump_right.png";

// Category images
import compass from "src/assets/background/puzzles/common/compass.png";
import fire from "src/assets/background/puzzles/common/fire.png";
import arrow from "src/assets/background/puzzles/common/arrow.png";
import maze from "src/assets/background/puzzles/common/maze.png";

// Organized image collections
export const BACKGROUND_IMAGES = {
  puzzle_5: backgroundPuzzle5,
  puzzle_2: backgroundPuzzle2,
};

export const TRACK_IMAGES = {
  puzzle_5: trackPuzzle5,
  puzzle_2: trackPuzzle2,
};

export const DECORATIVE_IMAGES = {
  puzzle_5: {
    "anchor.png": anchor,
    "bone.png": bone,
    "coins.png": coins,
    "map.png": map,
    "stone_left.png": stoneLeft,
    "stone_right.png": stoneRight,
  },
  puzzle_2: {
    "fish.png": fish,
    "shell.png": shell,
    "stone_1.png": stone1,
    "stone_2.png": stone2,
    "stump_left.png": stumpLeft,
    "stump_right.png": stumpRight,
  },
};

export const CATEGORY_IMAGES = {
  "mate-in-one": compass,
  "mate-in-two": fire,
  "basic-tactics": arrow,
  maze: maze,
};

// Helper functions
export const getBackgroundImage = (puzzleId: string) => {
  return BACKGROUND_IMAGES[puzzleId as keyof typeof BACKGROUND_IMAGES];
};

export const getTrackImage = (puzzleId: string) => {
  return TRACK_IMAGES[puzzleId as keyof typeof TRACK_IMAGES];
};

export const getDecorativeImage = (puzzleId: string, imageName: string) => {
  const puzzleImages =
    DECORATIVE_IMAGES[puzzleId as keyof typeof DECORATIVE_IMAGES];
  return puzzleImages?.[imageName as keyof typeof puzzleImages];
};

export const getCategoryImage = (category: string) => {
  return CATEGORY_IMAGES[category as keyof typeof CATEGORY_IMAGES] || compass;
};
