import { useNavigate } from "react-router-dom";
import { ChessTutorialBoard } from "../components/ChessTutorialBoard";
import { useState } from "react";
import type { Square } from "../utils/SimplifiedChessEngine";
import GameComplete from "src/components/GameComplete/GameComplete";

export function PawnMove() {
  const navigate = useNavigate();
  const [showBoom, setShowBoom] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [currentGameStatus, setCurrentGameStatus] = useState<
    "playing" | "white_wins" | "draw"
  >("playing");

  const initialPosition = "8/1p6/p7/8/8/8/1P6/8 w - - 0 1";

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
      <h1>Как ходит пешка</h1>
      <button className="back-button" onClick={() => navigate("/")}>
        Вернуться назад
      </button>

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
