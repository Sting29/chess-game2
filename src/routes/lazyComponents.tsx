/**
 * Lazy-загружаемые компоненты для оптимизации производительности
 * Каждый компонент будет загружаться только при необходимости
 */

import { lazy } from "react";

// Обучение
export const HowToMove = lazy(() => import("src/pages/HowToMove/HowToMove"));
export const HowToPlay = lazy(() => import("src/pages/HowToPlay/HowToPlay"));
export const ChessMoves = lazy(() => import("src/pages/ChessMoves/ChessMoves"));
export const ChessBattle = lazy(
  () => import("src/pages/ChessBattle/ChessBattle")
);

// Головоломки
export const PuzzleList = lazy(() => import("src/pages/PuzzleList/PuzzleList"));
export const PuzzleSolver = lazy(() =>
  import("src/pages/PuzzleSolver/PuzzleSolver").then((module) => ({
    default: module.PuzzleSolver,
  }))
);
export const MazePuzzleList = lazy(
  () => import("src/pages/MazePuzzleList/MazePuzzleList")
);
export const MazePuzzleSolver = lazy(() =>
  import("src/pages/MazePuzzleSolver/MazePuzzleSolver").then((module) => ({
    default: module.MazePuzzleSolver,
  }))
);

// Игра
export const Play = lazy(() => import("src/pages/Play/Play"));
export const PlayWithPerson = lazy(
  () => import("src/pages/PlayWithPerson/PlayWithPerson")
);
export const PlayWithComputer = lazy(
  () => import("src/pages/PlayWithComputer/PlayWithComputer")
);
export const PlayWithComputerSelectLevel = lazy(
  () =>
    import("src/pages/PlayWithComputerSelectLevel/PlayWithComputerSelectLevel")
);

// Пользователь
export const Account = lazy(() => import("src/pages/Account/Account"));
export const SettingsPage = lazy(
  () => import("src/pages/SettingsPage/SettingsPage")
);

// Системные страницы
export const NotFound = lazy(() =>
  import("src/pages/NotFound/NotFound").then((module) => ({
    default: module.NotFound,
  }))
);

// Объект для удобного доступа
export const LazyComponents = {
  // Обучение
  HowToMove,
  HowToPlay,
  ChessMoves,
  ChessBattle,

  // Головоломки
  PuzzleList,
  PuzzleSolver,
  MazePuzzleList,
  MazePuzzleSolver,

  // Игра
  Play,
  PlayWithPerson,
  PlayWithComputer,
  PlayWithComputerSelectLevel,

  // Пользователь
  Account,
  SettingsPage,

  // Системные страницы
  NotFound,
} as const;
