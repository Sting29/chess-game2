import { useNavigate } from "react-router-dom";
import React from "react";
import { ChessTutorialBoard } from "../components/ChessTutorialBoard";
import { useState } from "react";
import type { Square } from "../utils/SimplifiedChessEngine";

type GameStatus = "white_wins" | "draw" | null;

export function PawnMove() {
  const navigate = useNavigate();
  const [showBoom, setShowBoom] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [gameStatus, setGameStatus] = useState<GameStatus>(null);

  const initialPosition = "8/1p6/p7/8/8/8/1P6/8 w - - 0 1";

  const handleCapture = (square: Square) => {
    setShowBoom(true);
    setTimeout(() => setShowBoom(false), 2000);
  };

  const handleComplete = (status: GameStatus) => {
    setGameComplete(true);
    setGameStatus(status);
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
      {gameComplete && (
        <div className="game-complete">
          {gameStatus === "white_wins"
            ? "Победа! Все черные фигуры побиты."
            : "Ничья! Нет больше возможных ходов."}
        </div>
      )}

      <button className="reset-button" onClick={() => window.location.reload()}>
        Сбросить
      </button>
    </div>
  );
}
