/**
 * Хелперы для генерации путей с параметрами
 */

import { ROUTES } from "./constants";

/**
 * Функции для генерации типизированных путей с параметрами
 */
export const generatePath = {
  // Обучение
  howToMovePiece: (pieceId: string): string =>
    ROUTES.HOW_TO_MOVE_PIECE.replace(":pieceId", pieceId),

  howToPlayBattle: (battleId: string): string =>
    ROUTES.HOW_TO_PLAY_BATTLE.replace(":battleId", battleId),

  // Головоломки
  puzzlesCategory: (categoryId: string): string =>
    ROUTES.PUZZLES_CATEGORY.replace(":categoryId", categoryId),

  puzzlesSolver: (categoryId: string, puzzleId: string): string =>
    ROUTES.PUZZLES_SOLVER.replace(":categoryId", categoryId).replace(
      ":puzzleId",
      puzzleId
    ),

  // Игра
  playComputerLevel: (level: string): string =>
    ROUTES.PLAY_COMPUTER_LEVEL.replace(":level", level),
} as const;

/**
 * Утилиты для работы с маршрутами
 */
export const routeUtils = {
  /**
   * Проверяет, соответствует ли текущий путь шаблону маршрута
   */
  matchesRoute: (currentPath: string, routePattern: string): boolean => {
    const regex = new RegExp(
      "^" + routePattern.replace(/:[^/]+/g, "[^/]+") + "$"
    );
    return regex.test(currentPath);
  },

  /**
   * Извлекает параметры из пути на основе шаблона
   */
  extractParams: (
    currentPath: string,
    routePattern: string
  ): Record<string, string> => {
    const paramNames =
      routePattern.match(/:([^/]+)/g)?.map((p) => p.slice(1)) || [];
    const regex = new RegExp(
      "^" + routePattern.replace(/:[^/]+/g, "([^/]+)") + "$"
    );
    const match = currentPath.match(regex);

    if (!match) return {};

    const params: Record<string, string> = {};
    paramNames.forEach((name, index) => {
      params[name] = match[index + 1];
    });

    return params;
  },

  /**
   * Проверяет, является ли маршрут защищенным
   */
  isProtectedRoute: (path: string): boolean => {
    return path !== ROUTES.ROOT;
  },
};
