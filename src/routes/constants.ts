/**
 * Константы для маршрутов приложения
 */

// Типизированные пути маршрутов
export const ROUTES = {
  // Основные страницы
  ROOT: "/",

  // Обучение
  HOW_TO_MOVE: "/how-to-move",
  HOW_TO_MOVE_PIECE: "/how-to-move/:pieceId",
  HOW_TO_PLAY: "/how-to-play",
  HOW_TO_PLAY_BATTLE: "/how-to-play/:battleId",

  // Головоломки
  PUZZLES: "/puzzles",
  PUZZLES_CATEGORY: "/puzzles/:categoryId",
  PUZZLES_SOLVER: "/puzzles/:categoryId/:puzzleId",

  // Игра
  PLAY: "/play",
  PLAY_PERSON: "/play/person",
  PLAY_COMPUTER: "/play/computer",
  PLAY_COMPUTER_LEVEL: "/play/computer/:level",

  // Пользователь
  ACCOUNT: "/account",
  SETTINGS: "/settings",

  // Системные
  NOT_FOUND: "*",
} as const;
