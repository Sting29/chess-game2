import { useLocation } from "react-router-dom";
import { ChessBattleBoard } from "src/components/ChessBattleBoard";
import { useState } from "react";
import { Square } from "src/types/types";
import GameComplete from "src/components/GameComplete/GameComplete";
import BackButton from "src/components/BackButton/BackButton";

function KnightBattle() {
  const [showBoom, setShowBoom] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [currentGameStatus, setCurrentGameStatus] = useState<
    "playing" | "white_wins" | "black_wins" | "draw"
  >("playing");

  const initialPosition = "1n4n1/8/8/8/8/8/8/1N4N1 w - - 0 1";
  const previousPage = useLocation().pathname.split("/").slice(0, -1).join("/");

  const handleCapture = (square: Square) => {
    setShowBoom(true);
    setTimeout(() => setShowBoom(false), 500);
  };

  const handleComplete = (
    gameStatus: "playing" | "white_wins" | "black_wins" | "draw"
  ) => {
    if (
      gameStatus === "white_wins" ||
      gameStatus === "black_wins" ||
      gameStatus === "draw"
    ) {
      setGameComplete(true);
    }
    setCurrentGameStatus(gameStatus);
  };

  return (
    <div className="tutorial-page">
      <h1>Knight Battle</h1>
      <BackButton linkToPage={previousPage} />

      <ChessBattleBoard
        initialPosition={initialPosition}
        onCapture={handleCapture}
        onComplete={handleComplete}
      />

      {showBoom && <div className="boom-animation">BOOM!</div>}
      {gameComplete && <GameComplete gameStatus={currentGameStatus} />}

      <button className="reset-button" onClick={() => window.location.reload()}>
        Reset
      </button>
    </div>
  );
}

export default KnightBattle;
