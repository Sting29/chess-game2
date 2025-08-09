// Difficulty levels configuration for computer play
import ChessPawn from "src/assets/images/slides/slide_pawn.png";
import ChessKnight from "src/assets/images/slides/slide_knight.png";
import ChessQueen from "src/assets/images/slides/slide_queen.png";
import ChessKing from "src/assets/images/slides/slide_king.png";
import TeacherBaby from "src/assets/avatars/teacher_baby.png";
import TeacherChild from "src/assets/avatars/teacher_child.png";
import TeacherTeenager from "src/assets/avatars/teacher_teenager.png";
import TeacherAdult from "src/assets/avatars/teacher_adult.png";
import { DifficultyLevel, DifficultyId } from "src/types/computerGameTypes";

// Settings for different difficulty levels
export const DIFFICULTY_LEVELS: Record<string, DifficultyLevel> = {
  easy: {
    id: DifficultyId.EASY,
    titleKey: "easy",
    description: "Kids mode for the youngest players",
    ageGroupKey: "easy_age_group",
    featuresKey: "easy_features",
    image: ChessPawn,
    widgetSize: "large",
    avatar: TeacherBaby,
    engineSettings: {
      skill: 0, // Minimum level
      depth: 1, // Minimum depth
      time: 300, // 0.3 seconds per move
      MultiPV: 3, // Analyze 3 variations
      threads: 1, // Single thread
      kidsMode: true, // Kids mode enabled
    },
    uiSettings: {
      showLastMoveArrow: false, // Show arrow (helps kids)
      showThreatHighlight: true, // Highlight threats
      showMoveHints: true, // Show hints
      enableSoundEffects: true, // Sounds for fun
    },
  },

  medium: {
    id: DifficultyId.MEDIUM,
    titleKey: "medium",
    description: "Mode for older kids without hints",
    ageGroupKey: "medium_age_group",
    featuresKey: "medium_features",
    image: ChessKnight,
    widgetSize: "large",
    avatar: TeacherChild,
    engineSettings: {
      skill: 1, // Very low level
      depth: 1, // Minimum depth
      time: 500, // 0.5 seconds per move
      MultiPV: 2, // Analyze 2 variations
      threads: 1, // Single thread
      kidsMode: false, // No kids mode (no hints)
    },
    uiSettings: {
      showLastMoveArrow: false, // Show arrow
      showThreatHighlight: false, // Don't highlight threats
      showMoveHints: false, // No hints
      enableSoundEffects: true, // Keep sounds
    },
  },

  hard: {
    id: DifficultyId.HARD,
    titleKey: "hard",
    description: "Challenging mode for experienced players",
    ageGroupKey: "hard_age_group",
    featuresKey: "hard_features",
    image: ChessQueen,
    widgetSize: "large",
    avatar: TeacherTeenager,
    engineSettings: {
      skill: 5, // Medium-low level
      depth: 5, // Moderate depth
      time: 1000, // 1 second per move
      MultiPV: 1, // Analyze best variation
      threads: 1, // Single thread
      kidsMode: false, // No kids mode
    },
    uiSettings: {
      showLastMoveArrow: false, // Show arrow
      showThreatHighlight: false, // Don't highlight threats
      showMoveHints: false, // No hints
      enableSoundEffects: false, // No sounds (serious game)
    },
  },
  master: {
    id: DifficultyId.MASTER,
    titleKey: "master",
    description: "Challenging mode for experienced players",
    ageGroupKey: "master_age_group",
    featuresKey: "master_features",
    image: ChessKing,
    widgetSize: "large",
    avatar: TeacherAdult,
    engineSettings: {
      skill: 10, // Medium-low level
      depth: 10, // Moderate depth
      time: 1000, // 1 second per move
      MultiPV: 1, // Analyze best variation
      threads: 1, // Single thread
      kidsMode: false, // No kids mode
    },
    uiSettings: {
      showLastMoveArrow: false, // Show arrow
      showThreatHighlight: false, // Don't highlight threats
      showMoveHints: false, // No hints
      enableSoundEffects: false, // No sounds (serious game)
    },
  },
};

// Default settings for unknown level
export const DEFAULT_DIFFICULTY = DIFFICULTY_LEVELS.medium;

// Function to get settings by level
export const getDifficultySettings = (
  level: string | undefined
): DifficultyLevel => {
  if (level && level in DIFFICULTY_LEVELS) {
    return DIFFICULTY_LEVELS[level];
  }
  return DEFAULT_DIFFICULTY;
};

// Function to get all difficulty levels as an array (for UI components)
export const getDifficultyLevelsArray = (): DifficultyLevel[] => {
  return Object.values(DIFFICULTY_LEVELS);
};

// Parameter descriptions for UI settings - using translation keys
export const SETTING_DESCRIPTIONS = {
  skill: {
    nameKey: "setting_skill_name",
    descriptionKey: "setting_skill_description",
    range: "0-20",
  },
  depth: {
    nameKey: "setting_depth_name",
    descriptionKey: "setting_depth_description",
    range: "1-20",
  },
  time: {
    nameKey: "setting_time_name",
    descriptionKey: "setting_time_description",
    range: "100-5000",
  },
  MultiPV: {
    nameKey: "setting_multipv_name",
    descriptionKey: "setting_multipv_description",
    range: "1-5",
  },
  threads: {
    nameKey: "setting_threads_name",
    descriptionKey: "setting_threads_description",
    range: "1-4",
  },
  kidsMode: {
    nameKey: "setting_kids_mode_name",
    descriptionKey: "setting_kids_mode_description",
    range: "true/false",
  },
  showLastMoveArrow: {
    nameKey: "setting_last_move_arrow_name",
    descriptionKey: "setting_last_move_arrow_description",
    range: "true/false",
  },
};
