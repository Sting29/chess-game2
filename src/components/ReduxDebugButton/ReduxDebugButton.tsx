import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

interface ReduxDebugButtonProps {
  buttonText?: string;
  style?: React.CSSProperties;
  className?: string;
}

const ReduxDebugButton: React.FC<ReduxDebugButtonProps> = ({
  buttonText = "Redux Debug",
  style,
  className,
}) => {
  // Получаем все состояние Redux
  const entireReduxState = useSelector((state: RootState) => state);

  const handleReduxDebug = () => {
    console.clear(); // Очищаем консоль для лучшей читаемости

    console.group("🔍 Redux State Debug");
    console.log("📊 Полное состояние Redux Store:", entireReduxState);

    // Выводим каждый слайс отдельно для удобства
    console.group("⚙️ Settings State");
    console.log("User:", entireReduxState.settings.user);
    console.log("Language:", entireReduxState.settings.language);
    console.log("Chess Set:", entireReduxState.settings.chessSet);
    console.log("Is Authenticated:", entireReduxState.settings.isAuthenticated);
    console.log("Loading:", entireReduxState.settings.loading);
    console.log("Error:", entireReduxState.settings.error);
    console.log(
      "Initial Check Complete:",
      entireReduxState.settings.initialCheckComplete
    );
    console.groupEnd();

    console.group("📈 Progress State");
    console.log("All Progress Items:", entireReduxState.progress.items);
    console.log("Current Progress:", entireReduxState.progress.currentProgress);
    console.log("Loading:", entireReduxState.progress.loading);
    console.log("Error:", entireReduxState.progress.error);
    console.log("Last Fetch:", entireReduxState.progress.lastFetch);
    console.groupEnd();

    console.group("🧩 Maze Progress State");
    console.log(
      "Completed Puzzles:",
      entireReduxState.mazeProgress.completedPuzzles
    );
    console.log(
      "Current Puzzle ID:",
      entireReduxState.mazeProgress.currentPuzzleId
    );
    console.log("Total Puzzles:", entireReduxState.mazeProgress.totalPuzzles);
    console.log(
      "Completion Percentage:",
      entireReduxState.mazeProgress.completionPercentage
    );
    console.groupEnd();

    // Дополнительная статистика
    console.group("📊 Statistics");
    console.log(
      "Total Progress Items:",
      entireReduxState.progress.items.length
    );
    console.log(
      "Completed Maze Puzzles:",
      entireReduxState.mazeProgress.completedPuzzles.length
    );
    console.log(
      "User Name:",
      entireReduxState.settings.user?.name || "Not logged in"
    );
    console.log(
      "Authentication Status:",
      entireReduxState.settings.isAuthenticated
        ? "✅ Authenticated"
        : "❌ Not Authenticated"
    );
    console.groupEnd();

    console.groupEnd();

    // Также выводим в виде JSON для копирования
    console.log(
      "📋 JSON для копирования:",
      JSON.stringify(entireReduxState, null, 2)
    );
  };

  const defaultStyle: React.CSSProperties = {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
    transition: "background-color 0.2s",
    ...style,
  };

  return (
    <button
      onClick={handleReduxDebug}
      style={defaultStyle}
      className={className}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#0056b3";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor =
          style?.backgroundColor || "#007bff";
      }}
    >
      {buttonText}
    </button>
  );
};

export default ReduxDebugButton;
