import { useState, useEffect } from "react";
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

  // Сброс состояния при изменении puzzleId
  useEffect(() => {
    setShowHint(false);
    setGameComplete(false);
    setKey((prev) => prev + 1);
  }, [puzzleId]);

  const category = CHESS_PUZZLES.find((c) => c.id === categoryId);
  const currentPuzzleIndex =
    category?.puzzles.findIndex((p) => p.id === puzzleId) ?? -1;
  const puzzle = category?.puzzles[currentPuzzleIndex];
  const hasNextPuzzle =
    category && currentPuzzleIndex < category.puzzles.length - 1;
  const nextPuzzle = hasNextPuzzle
    ? category?.puzzles[currentPuzzleIndex + 1]
    : null;

  if (!puzzle) {
    return <div>Задача не найдена</div>;
  }

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

  const handleNextPuzzle = () => {
    if (nextPuzzle) {
      navigate(`/puzzles/${categoryId}/${nextPuzzle.id}`);
    } else {
      navigate(`/puzzles/${categoryId}`);
    }
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
            {hasNextPuzzle ? (
              <button className="next-puzzle-button" onClick={handleNextPuzzle}>
                Следующая задача
              </button>
            ) : (
              <button
                className="next-puzzle-button"
                onClick={() => navigate(`/puzzles/${categoryId}`)}
              >
                К списку задач
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
