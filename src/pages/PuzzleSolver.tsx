import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChessPuzzleBoard } from "../components/ChessPuzzleBoard";
import { CHESS_PUZZLES } from "../data/puzzles";
import BackButton from "../components/BackButton/BackButton";

export function PuzzleSolver() {
  const { categoryId, puzzleId } = useParams();
  const navigate = useNavigate();

  const [showHint, setShowHint] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [key, setKey] = useState(0); // Ключ для форсированного перерендера доски

  // Находим нужную задачу
  const category = CHESS_PUZZLES.find((c) => c.id === categoryId);
  const puzzle = category?.puzzles.find((p) => p.id === puzzleId);

  if (!puzzle) {
    return <div>Задача не найдена</div>;
  }

  // Преобразуем initialPosition в FEN
  const positionToFen = (position: { [key: string]: string }) => {
    let fen = "";
    for (let rank = 8; rank >= 1; rank--) {
      let emptySquares = 0;
      for (let file = "a".charCodeAt(0); file <= "h".charCodeAt(0); file++) {
        const square = String.fromCharCode(file) + rank;
        const piece = position[square];
        if (piece) {
          if (emptySquares > 0) {
            fen += emptySquares;
            emptySquares = 0;
          }
          fen += piece;
        } else {
          emptySquares++;
        }
      }
      if (emptySquares > 0) {
        fen += emptySquares;
      }
      if (rank > 1) {
        fen += "/";
      }
    }
    return `${fen} ${puzzle.playerColor} - - 0 1`;
  };

  const handleComplete = (result: "success" | "failure") => {
    if (result === "success") {
      setGameComplete(true);
    }
  };

  const handleReset = () => {
    setGameComplete(false);
    setShowHint(false);
    setKey((prev) => prev + 1); // Изменение ключа вызовет перерендер доски
  };

  return (
    <div className="tutorial-page">
      <h1>{puzzle.title}</h1>
      <BackButton linkToPage={`/puzzles/${categoryId}`} />

      <div className="puzzle-description">
        <p>{puzzle.description}</p>
      </div>

      <ChessPuzzleBoard
        key={key} // Ключ для перерендера
        initialPosition={puzzle.initialPosition}
        correctMoves={puzzle.correctMoves}
        onComplete={handleComplete}
      />

      <div className="puzzle-controls">
        <button className="hint-button" onClick={() => setShowHint(!showHint)}>
          {showHint ? "Скрыть подсказку" : "Показать подсказку"}
        </button>
        <button className="reset-button" onClick={handleReset}>
          Начать заново
        </button>
      </div>

      {showHint && (
        <div className="hint-container">
          <p className="hint-text">{puzzle.hint}</p>
        </div>
      )}

      {gameComplete && (
        <div className="game-complete">
          <h2>Задача решена!</h2>
          <div className="puzzle-complete-buttons">
            <button
              className="next-puzzle-button"
              onClick={() => navigate(`/puzzles/${categoryId}`)}
            >
              К списку задач
            </button>
            <button className="reset-button" onClick={handleReset}>
              Решить ещё раз
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
