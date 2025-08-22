/**
 * Типы для роутинга приложения
 */

import { ROUTES } from "./constants";

// Базовые типы параметров маршрутов
export interface RouteParams {
  pieceId?: string;
  categoryId?: string;
  puzzleId?: string;
  battleId?: string;
  level?: string;
}

// Типы для маршрутов
export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];

// Мета-данные для маршрутов
export interface RouteMetadata {
  title: string;
  description?: string;
  requiresAuth: boolean;
  preloadData?: boolean;
}

// Реэкспорт констант для удобства
export { ROUTES } from "./constants";
