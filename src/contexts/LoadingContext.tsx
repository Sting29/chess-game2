/**
 * Loading Context для управления глобальными состояниями загрузки
 */

import { createContext, useContext } from "react";

export interface LoadingState {
  key: string;
  startTime: number;
  message?: string;
  delay: number;
  visible: boolean;
  timeoutId?: NodeJS.Timeout;
}

export interface LoadingContextType {
  // Глобальные состояния загрузки
  isGlobalLoading: boolean;
  loadingMessage?: string;

  // Методы управления загрузкой
  startLoading: (key: string, message?: string, delay?: number) => void;
  stopLoading: (key: string) => void;

  // Утилитарные методы
  isLoading: (key?: string) => boolean;
  getActiveLoadingKeys: () => string[];
}

export const LoadingContext = createContext<LoadingContextType | undefined>(
  undefined
);

export function useLoadingContext(): LoadingContextType {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoadingContext must be used within a LoadingProvider");
  }
  return context;
}
