import { useLocation } from "react-router-dom";
import { ChessTutorialBoard } from "../components/ChessTutorialBoard";
import { useState } from "react";
import type { Square } from "../utils/SimplifiedChessEngine";
import GameComplete from "src/components/GameComplete/GameComplete";
import BackButton from "src/components/BackButton/BackButton";

export function QueenMove() {
  const [showBoom, setShowBoom] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [currentGameStatus, setCurrentGameStatus] = useState<
    "playing" | "white_wins" | "draw"
  >("playing");

  const initialPosition = "8/8/1p6/3p4/8/5p2/8/3Q4 w - - 0 1";
  const previousPage = useLocation().pathname.split("/").slice(0, -1).join("/");

  const handleCapture = (square: Square) => {
    setShowBoom(true);
    setTimeout(() => setShowBoom(false), 500);
  };

  const handleComplete = (gameStatus: "playing" | "white_wins" | "draw") => {
    if (gameStatus === "white_wins" || gameStatus === "draw") {
      setGameComplete(true);
    }
    setCurrentGameStatus(gameStatus);
  };

  return (
    <div className="tutorial-page">
      <h1>Как ходит ферзь</h1>
      <BackButton linkToPage={previousPage} />

      <ChessTutorialBoard
        initialPosition={initialPosition}
        onCapture={handleCapture}
        onComplete={handleComplete}
      />

      {showBoom && <div className="boom-animation">BOOM!</div>}
      {gameComplete && <GameComplete gameStatus={currentGameStatus} />}

      <button className="reset-button" onClick={() => window.location.reload()}>
        Сбросить
      </button>
    </div>
  );
}
