/**
 * Утилиты для навигации без хуков (для использования вне компонентов)
 */

import { ROUTES } from "./constants";
import { generatePath } from "./pathHelpers";

export const navigationUtils = {
  /**
   * Создает URL для маршрута с параметрами
   */
  createUrl: {
    howToMovePiece: (pieceId: string) => generatePath.howToMovePiece(pieceId),
    howToPlayBattle: (battleId: string) =>
      generatePath.howToPlayBattle(battleId),
    puzzlesCategory: (categoryId: string) =>
      generatePath.puzzlesCategory(categoryId),
    puzzlesSolver: (categoryId: string, puzzleId: string) =>
      generatePath.puzzlesSolver(categoryId, puzzleId),
    playComputerLevel: (level: string) => generatePath.playComputerLevel(level),
  },

  /**
   * Проверяет, является ли путь валидным маршрутом
   */
  isValidRoute: (path: string): boolean => {
    return Object.values(ROUTES).includes(path as any);
  },

  /**
   * Извлекает базовый путь без параметров
   */
  getBasePath: (path: string): string => {
    return path.split("/")[1] ? `/${path.split("/")[1]}` : "/";
  },

  /**
   * Создает breadcrumbs для текущего пути
   */
  createBreadcrumbs: (path: string): Array<{ label: string; path: string }> => {
    const segments = path.split("/").filter(Boolean);
    const breadcrumbs: Array<{ label: string; path: string }> = [
      { label: "Home", path: ROUTES.ROOT },
    ];

    let currentPath = "";
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;

      // Пропускаем параметры (содержат только цифры или специальные символы)
      if (!/^[a-zA-Z]/.test(segment)) return;

      const label =
        segment.charAt(0).toUpperCase() + segment.slice(1).replace("-", " ");
      breadcrumbs.push({
        label,
        path: currentPath,
      });
    });

    return breadcrumbs;
  },
};
