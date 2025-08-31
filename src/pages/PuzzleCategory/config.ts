// Simple configuration for PuzzleCategory
import backgroundPuzzlesClear from "src/assets/background/puzzles/puzzle_5/background_puzzles_clear.png";
import track from "src/assets/background/puzzles/puzzle_5/track.png";
import compass from "src/assets/background/puzzles/common/compass.png";
import fire from "src/assets/background/puzzles/common/fire.png";
import arrow from "src/assets/background/puzzles/common/arrow.png";
import maze from "src/assets/background/puzzles/common/maze.png";

const ADDRESS_PUZZLES = "src/assets/background/puzzles";

export interface DecorativeElementConfig {
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  show: boolean;
  animationType: "none";
}

export interface CategoryImagePosition {
  x: number;
  y: number;
  width: number;
  height: number;
  show: boolean;
  animationType: "none";
}

export interface BackgroundConfig {
  id: string;
  address: string;
  background: string; // Imported image path
  track: string; // Imported image path
  stonePositions: { x: number; y: number }[];
  trackPosition: { x: number; y: number };
  decorativeElements: DecorativeElementConfig[];
  categoryImagePosition: CategoryImagePosition;
}

export interface CategoryImageConfig {
  category: string;
  image: string;
}

// Background configurations
export const backgroundConfigs: Record<number, BackgroundConfig> = {
  0: {
    id: "puzzle_5",
    address: `${ADDRESS_PUZZLES}/puzzle_5`,
    background: backgroundPuzzlesClear,
    track: track,
    trackPosition: { x: 50, y: 50 },
    stonePositions: [
      { x: 32, y: 32 }, // Stone 1 - Start of path, left side
      { x: 21, y: 42 }, // Stone 2 - Moving down left
      { x: 22, y: 60 }, // Stone 3 - Bottom left curve
      { x: 34, y: 67 }, // Stone 4 - Starting to curve right
      { x: 46, y: 58 }, // Stone 5 - Bottom center
      { x: 50, y: 40 }, // Stone 6 - Moving up right
      { x: 60, y: 32 }, // Stone 7 - Right side curve
      { x: 73, y: 38 }, // Stone 8 - Moving up right
      { x: 75, y: 54 }, // Stone 9 - Top right curve
      { x: 65, y: 63 }, // Stone 10 - End of path, top center
    ],
    decorativeElements: [
      {
        name: "anchor.png",
        x: 85,
        y: 20,
        width: 150,
        height: 200,
        show: true,
        animationType: "none",
      },
      {
        name: "bone.png",
        x: 15,
        y: 80,
        width: 200,
        height: 150,
        show: true,
        animationType: "none",
      },
      {
        name: "coins.png",
        x: 22,
        y: 85,
        width: 70,
        height: 70,
        show: true,
        animationType: "none",
      },
      {
        name: "map.png",
        x: 38,
        y: 49,
        width: 100,
        height: 100,
        show: true,
        animationType: "none",
      },
      {
        name: "stone_left.png",
        x: 5,
        y: 55,
        width: 300,
        height: 300,
        show: true,
        animationType: "none",
      },
      {
        name: "stone_right.png",
        x: 95,
        y: 55,
        width: 400,
        height: 400,
        show: true,
        animationType: "none",
      },
    ],
    categoryImagePosition: {
      x: 80,
      y: 80,
      width: 120,
      height: 120,
      show: true,
      animationType: "none",
    },
  },
};

// Category configurations
export const categoryImageConfigs = [
  {
    category: "mate-in-one",
    image: compass,
  },
  {
    category: "mate-in-two",
    image: fire,
  },
  {
    category: "basic-tactics",
    image: arrow,
  },
  {
    category: "maze",
    image: maze,
  },
];

// Get background configuration
export const getBackgroundConfig = (pageNumber: number): BackgroundConfig => {
  return backgroundConfigs[pageNumber] || backgroundConfigs[0];
};

// Get category configuration
export const getCategoryImageConfig = (
  category: string
): CategoryImageConfig => {
  return (
    categoryImageConfigs.find((config) => config.category === category) ||
    (categoryImageConfigs[0] as CategoryImageConfig)
  );
};

// Get category image path by category
export const getCategoryImage = (category: string): string => {
  const config = categoryImageConfigs.find((c) => c.category === category);
  return config?.image || categoryImageConfigs[0].image;
};
