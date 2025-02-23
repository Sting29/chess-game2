import { useNavigate } from "react-router-dom";
import { ChessTutorialBoard } from "../components/ChessTutorialBoard";
import { useState } from "react";
import { SimplifiedChessEngine } from "../utils/SimplifiedChessEngine";
import type { Square } from "../utils/SimplifiedChessEngine";

export function QueenMove() {
  const navigate = useNavigate();
  const [showBoom, setShowBoom] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  const initialPosition = "8/8/1p6/3p4/8/5p2/8/3Q4 w - - 0 1";
  const [game] = useState(new SimplifiedChessEngine(initialPosition));

  const handleCapture = (square: Square) => {
    setShowBoom(true);
    setTimeout(() => setShowBoom(false), 2000);
  };

  const handleComplete = () => {
    setGameComplete(true);
  };

  return (
    <div className="tutorial-page">
      <h1>Как ходит ферзь</h1>
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
          {game.getGameStatus() === "white_wins"
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
