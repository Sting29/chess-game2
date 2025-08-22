/**
 * Типизированные хуки для работы с параметрами маршрутов
 */

import { useParams, useLocation, useNavigate } from "react-router-dom";
import { RouteParams } from "src/routes/types";

/**
 * Базовый типизированный хук для получения параметров маршрута
 */
export function useTypedParams<T extends RouteParams = RouteParams>(): T {
  return useParams() as unknown as T;
}

/**
 * Специализированные хуки для конкретных типов маршрутов
 */

// Для маршрутов с pieceId
export function usePieceParams() {
  return useTypedParams<{ pieceId: string }>();
}

// Для маршрутов с categoryId
export function useCategoryParams() {
  return useTypedParams<{ categoryId: string }>();
}

// Для маршрутов с puzzleId (только maze)
export function useMazePuzzleParams() {
  return useTypedParams<{ puzzleId: string }>();
}

// Для маршрутов с categoryId и puzzleId
export function usePuzzleParams() {
  return useTypedParams<{ categoryId: string; puzzleId: string }>();
}

// Для маршрутов с battleId
export function useBattleParams() {
  return useTypedParams<{ battleId: string }>();
}

// Для маршрутов с level
export function useLevelParams() {
  return useTypedParams<{ level: string }>();
}

/**
 * Хук для получения информации о текущем маршруте
 */
export function useRouteInfo() {
  const location = useLocation();
  const params = useParams();

  return {
    pathname: location.pathname,
    search: location.search,
    hash: location.hash,
    state: location.state,
    params,
    // Полезные утилиты
    isRoot: location.pathname === "/",
    hasParams: Object.keys(params).length > 0,
    searchParams: new URLSearchParams(location.search),
  };
}

/**
 * Хук для работы с query параметрами
 */
export function useQueryParams() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);

  const setQueryParam = (key: string, value: string) => {
    searchParams.set(key, value);
    navigate(`${location.pathname}?${searchParams.toString()}`, {
      replace: true,
    });
  };

  const removeQueryParam = (key: string) => {
    searchParams.delete(key);
    navigate(`${location.pathname}?${searchParams.toString()}`, {
      replace: true,
    });
  };

  const getQueryParam = (key: string): string | null => {
    return searchParams.get(key);
  };

  const getAllQueryParams = (): Record<string, string> => {
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  };

  return {
    searchParams,
    setQueryParam,
    removeQueryParam,
    getQueryParam,
    getAllQueryParams,
  };
}

/**
 * Хук для проверки активного маршрута
 */
export function useActiveRoute() {
  const location = useLocation();

  const isActive = (path: string, exact: boolean = false): boolean => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const isActivePattern = (pattern: string): boolean => {
    const regex = new RegExp("^" + pattern.replace(/:[^/]+/g, "[^/]+") + "$");
    return regex.test(location.pathname);
  };

  return {
    currentPath: location.pathname,
    isActive,
    isActivePattern,
  };
}
