/**
 * Простая система управления заголовков страниц
 */

import { ROUTES } from "./constants";
import type { RouteMetadata } from "./types";

// Базовые мета-данные для всех маршрутов
export const ROUTE_METADATA: Record<string, RouteMetadata> = {
  [ROUTES.ROOT]: {
    title: "Chess Learning App",
    description: "Learn chess with interactive tutorials and games",
    requiresAuth: false,
  },

  [ROUTES.HOW_TO_MOVE]: {
    title: "How Chess Pieces Move",
    description: "Learn how each chess piece moves",
    requiresAuth: true,
  },

  [ROUTES.HOW_TO_MOVE_PIECE]: {
    title: "How {pieceId} Moves",
    description: "Learn how {pieceId} moves in chess",
    requiresAuth: true,
  },

  [ROUTES.HOW_TO_PLAY]: {
    title: "How to Play Chess",
    description: "Complete guide to chess rules and gameplay",
    requiresAuth: true,
  },

  [ROUTES.HOW_TO_PLAY_BATTLE]: {
    title: "Chess Battle - {battleId}",
    description: "Learn chess through interactive battles",
    requiresAuth: true,
  },

  [ROUTES.PUZZLES]: {
    title: "Chess Puzzles",
    description: "Improve your chess skills with puzzles",
    requiresAuth: true,
  },

  [ROUTES.PUZZLES_CATEGORY]: {
    title: "Chess Puzzles - {categoryId}",
    description: "Practice {categoryId} chess puzzles",
    requiresAuth: true,
  },

  [ROUTES.PLAY]: {
    title: "Play Chess",
    description: "Choose your chess game mode",
    requiresAuth: true,
  },

  [ROUTES.PLAY_COMPUTER]: {
    title: "Play vs Computer",
    description: "Challenge computer opponents",
    requiresAuth: true,
  },

  [ROUTES.PLAY_PERSON]: {
    title: "Play vs Person",
    description: "Play chess against other players",
    requiresAuth: true,
  },

  [ROUTES.ACCOUNT]: {
    title: "Account Settings",
    description: "Manage your chess profile",
    requiresAuth: true,
  },

  [ROUTES.SETTINGS]: {
    title: "App Settings",
    description: "Customize your chess experience",
    requiresAuth: true,
  },

  [ROUTES.NOT_FOUND]: {
    title: "Page Not Found",
    description: "The requested page could not be found",
    requiresAuth: false,
  },
};

/**
 * Утилиты для работы с мета-данными
 */
export const metadataUtils = {
  /**
   * Получить мета-данные для маршрута
   */
  getMetadata: (path: string): RouteMetadata | null => {
    // Попробуем найти точное совпадение
    if (ROUTE_METADATA[path]) {
      return ROUTE_METADATA[path];
    }

    // Попробуем найти по шаблону (для динамических маршрутов)
    for (const route in ROUTE_METADATA) {
      // Пропускаем маршруты без параметров
      if (!route.includes(":")) continue;

      const regex = new RegExp("^" + route.replace(/:[^/]+/g, "[^/]+") + "$");
      if (regex.test(path)) {
        return ROUTE_METADATA[route];
      }
    }

    return null;
  },

  /**
   * Создать динамический title с параметрами
   */
  createDynamicTitle: (
    baseTitle: string,
    params: Record<string, string>
  ): string => {
    let title = baseTitle;

    // Замена параметров в title
    Object.entries(params).forEach(([key, value]) => {
      const placeholder = `{${key}}`;
      if (title.includes(placeholder)) {
        title = title.replace(placeholder, value);
      }
    });

    return title;
  },

  /**
   * Создать полный title с названием приложения
   */
  createFullTitle: (pageTitle: string): string => {
    if (pageTitle.includes("Chess Learning App")) {
      return pageTitle;
    }
    return `${pageTitle} | Chess Learning App`;
  },

  /**
   * Получить базовые мета-теги для страницы
   */
  getMetaTags: (
    path: string,
    params?: Record<string, string>
  ): Record<string, string> => {
    const metadata = metadataUtils.getMetadata(path);
    if (!metadata) {
      return {
        title: "Chess Learning App",
        description: "Learn chess online with interactive tutorials and games",
      };
    }

    const title = params
      ? metadataUtils.createDynamicTitle(metadata.title, params)
      : metadata.title;

    const tags: Record<string, string> = {
      title: metadataUtils.createFullTitle(title),
    };

    if (metadata.description) {
      tags.description = params
        ? metadataUtils.createDynamicTitle(metadata.description, params)
        : metadata.description;
    }

    return tags;
  },
};
