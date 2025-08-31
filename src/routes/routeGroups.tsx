/**
 * Организация маршрутов по логическим группам
 */

import React from "react";
import { ROUTES } from "./constants";
import { RootRoute } from "src/components/RootRoute/RootRoute";
import { LazyComponents } from "./lazyComponents";
import { ProtectedRoute } from "./components";

/**
 * Корневой маршрут
 */
export const rootRoutes = [
  {
    path: ROUTES.ROOT,
    element: <RootRoute />,
  },
];

/**
 * Группа маршрутов для обучения
 */
export const learningRoutes = [
  {
    path: ROUTES.HOW_TO_MOVE,
    element: (
      <ProtectedRoute>
        <LazyComponents.HowToMove />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.HOW_TO_MOVE_PIECE,
    element: (
      <ProtectedRoute>
        <LazyComponents.ChessMoves />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.HOW_TO_PLAY,
    element: (
      <ProtectedRoute>
        <LazyComponents.HowToPlay />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.HOW_TO_PLAY_BATTLE,
    element: (
      <ProtectedRoute>
        <LazyComponents.ChessBattle />
      </ProtectedRoute>
    ),
  },
];

/**
 * Группа маршрутов для головоломок
 * ВАЖНО: Порядок имеет значение! Более специфичные роуты должны быть выше
 */
export const puzzleRoutes = [
  {
    path: ROUTES.PUZZLES,
    element: (
      <ProtectedRoute>
        <LazyComponents.PuzzleList />
      </ProtectedRoute>
    ),
  },
  // Более специфичный роут для решения задач (должен быть выше PUZZLES_CATEGORY)
  {
    path: ROUTES.PUZZLES_SOLVER,
    element: (
      <ProtectedRoute>
        <LazyComponents.PuzzleSolver />
      </ProtectedRoute>
    ),
  },
  // Роут для категории (теперь с query параметром ?page=N)
  {
    path: ROUTES.PUZZLES_CATEGORY,
    element: (
      <ProtectedRoute>
        <LazyComponents.PuzzleCategory />
      </ProtectedRoute>
    ),
  },
];

/**
 * Группа маршрутов для игры
 */
export const gameRoutes = [
  {
    path: ROUTES.PLAY,
    element: (
      <ProtectedRoute>
        <LazyComponents.Play />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.PLAY_PERSON,
    element: (
      <ProtectedRoute>
        <LazyComponents.PlayWithPerson />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.PLAY_COMPUTER,
    element: (
      <ProtectedRoute>
        <LazyComponents.PlayWithComputerSelectLevel />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.PLAY_COMPUTER_LEVEL,
    element: (
      <ProtectedRoute>
        <LazyComponents.PlayWithComputer />
      </ProtectedRoute>
    ),
  },
];

/**
 * Группа маршрутов для пользователя
 */
export const userRoutes = [
  {
    path: ROUTES.ACCOUNT,
    element: (
      <ProtectedRoute>
        <LazyComponents.Account />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.SETTINGS,
    element: (
      <ProtectedRoute>
        <LazyComponents.SettingsPage />
      </ProtectedRoute>
    ),
  },
];

/**
 * Системные маршруты
 */
export const systemRoutes = [
  {
    path: ROUTES.NOT_FOUND,
    element: (
      <ProtectedRoute requireAuth={false}>
        <LazyComponents.NotFound />
      </ProtectedRoute>
    ),
  },
];

/**
 * Все маршруты, объединенные в правильном порядке
 */
export const allRoutes = [
  ...rootRoutes,
  ...learningRoutes,
  ...puzzleRoutes,
  ...gameRoutes,
  ...userRoutes,
  ...systemRoutes,
];
