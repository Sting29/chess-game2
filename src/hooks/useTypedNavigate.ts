/**
 * Типизированная навигация с автокомплитом
 */

import {
  NavigateFunction,
  NavigateOptions,
  useNavigate,
} from "react-router-dom";
import { ROUTES } from "src/routes/types";
import { generatePath } from "src/routes/pathHelpers";

/**
 * Класс для типизированной навигации
 */
export class TypedNavigator {
  constructor(private navigate: NavigateFunction) {}

  // Основные страницы
  goToRoot(options?: NavigateOptions) {
    this.navigate(ROUTES.ROOT, options);
  }

  // Обучение
  goToHowToMove(options?: NavigateOptions) {
    this.navigate(ROUTES.HOW_TO_MOVE, options);
  }

  goToHowToMovePiece(pieceId: string, options?: NavigateOptions) {
    this.navigate(generatePath.howToMovePiece(pieceId), options);
  }

  goToHowToPlay(options?: NavigateOptions) {
    this.navigate(ROUTES.HOW_TO_PLAY, options);
  }

  goToHowToPlayBattle(battleId: string, options?: NavigateOptions) {
    this.navigate(generatePath.howToPlayBattle(battleId), options);
  }

  // Головоломки
  goToPuzzles(options?: NavigateOptions) {
    this.navigate(ROUTES.PUZZLES, options);
  }

  goToPuzzlesCategory(categoryId: string, options?: NavigateOptions) {
    this.navigate(generatePath.puzzlesCategory(categoryId), options);
  }

  goToPuzzlesSolver(
    categoryId: string,
    puzzleId: string,
    options?: NavigateOptions
  ) {
    this.navigate(generatePath.puzzlesSolver(categoryId, puzzleId), options);
  }

  goToPuzzlesMaze(options?: NavigateOptions) {
    this.navigate(generatePath.puzzlesCategory("maze"), options);
  }

  goToPuzzlesMazeSolver(puzzleId: string, options?: NavigateOptions) {
    this.navigate(generatePath.puzzlesMazeSolver(puzzleId), options);
  }

  // Игра
  goToPlay(options?: NavigateOptions) {
    this.navigate(ROUTES.PLAY, options);
  }

  goToPlayPerson(options?: NavigateOptions) {
    this.navigate(ROUTES.PLAY_PERSON, options);
  }

  goToPlayComputer(options?: NavigateOptions) {
    this.navigate(ROUTES.PLAY_COMPUTER, options);
  }

  goToPlayComputerLevel(level: string, options?: NavigateOptions) {
    this.navigate(generatePath.playComputerLevel(level), options);
  }

  // Пользователь
  goToAccount(options?: NavigateOptions) {
    this.navigate(ROUTES.ACCOUNT, options);
  }

  goToSettings(options?: NavigateOptions) {
    this.navigate(ROUTES.SETTINGS, options);
  }

  // Универсальная навигация
  goTo(path: string, options?: NavigateOptions) {
    this.navigate(path, options);
  }

  // Навигация по истории
  goBack() {
    this.navigate(-1);
  }

  goForward() {
    this.navigate(1);
  }

  // Замена текущего маршрута
  replace(path: string, options?: Omit<NavigateOptions, "replace">) {
    this.navigate(path, { ...options, replace: true });
  }
}

/**
 * Хук для получения типизированного навигатора
 */
export function useTypedNavigate(): TypedNavigator {
  const navigate = useNavigate();
  return new TypedNavigator(navigate);
}
