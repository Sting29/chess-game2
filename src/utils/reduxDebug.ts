import { store } from "../store";

/**
 * Функция для вывода всего состояния Redux в консоль
 * Можно вызвать из любого места в приложении
 */
export const logReduxState = () => {
  const state = store.getState();

  console.clear();
  console.group("🔍 Redux State Debug");
  console.log("📊 Полное состояние Redux Store:", state);

  // Выводим каждый слайс отдельно
  console.group("⚙️ Settings State");
  console.log("User:", state.settings.user);
  console.log("Language:", state.settings.language);
  console.log("Chess Set:", state.settings.chessSet);
  console.log("Is Authenticated:", state.settings.isAuthenticated);
  console.log("Loading:", state.settings.loading);
  console.log("Error:", state.settings.error);
  console.log("Initial Check Complete:", state.settings.initialCheckComplete);
  console.groupEnd();

  console.group("📈 Progress State");
  console.log("All Progress Items:", state.progress.items);
  console.log("Current Progress:", state.progress.currentProgress);
  console.log("Loading:", state.progress.loading);
  console.log("Error:", state.progress.error);
  console.log("Last Fetch:", state.progress.lastFetch);
  console.groupEnd();

  console.group("🧩 Maze Progress State");
  console.log("Completed Puzzles:", state.mazeProgress.completedPuzzles);
  console.log("Current Puzzle ID:", state.mazeProgress.currentPuzzleId);
  console.log("Total Puzzles:", state.mazeProgress.totalPuzzles);
  console.log(
    "Completion Percentage:",
    state.mazeProgress.completionPercentage
  );
  console.groupEnd();

  // Статистика
  console.group("📊 Statistics");
  console.log("Total Progress Items:", state.progress.items.length);
  console.log(
    "Completed Maze Puzzles:",
    state.mazeProgress.completedPuzzles.length
  );
  console.log("User Name:", state.settings.user?.name || "Not logged in");
  console.log(
    "Authentication Status:",
    state.settings.isAuthenticated ? "✅ Authenticated" : "❌ Not Authenticated"
  );
  console.groupEnd();

  console.groupEnd();

  // JSON для копирования
  console.log("📋 JSON для копирования:", JSON.stringify(state, null, 2));

  return state;
};

/**
 * Функция для вывода только определенного слайса состояния
 */
export const logReduxSlice = (
  sliceName: "settings" | "progress" | "mazeProgress"
) => {
  const state = store.getState();
  const slice = state[sliceName];

  console.group(`🔍 Redux ${sliceName} Slice Debug`);
  console.log(`${sliceName} state:`, slice);
  console.log(`${sliceName} JSON:`, JSON.stringify(slice, null, 2));
  console.groupEnd();

  return slice;
};

/**
 * Добавляем функции в глобальный объект window для удобного доступа из консоли браузера
 */
if (typeof window !== "undefined") {
  (window as any).logReduxState = logReduxState;
  (window as any).logReduxSlice = logReduxSlice;
  (window as any).reduxStore = store;
}
