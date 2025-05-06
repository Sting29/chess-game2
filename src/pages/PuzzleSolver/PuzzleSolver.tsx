import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ChessPuzzleBoard } from "../../components/ChessPuzzleBoard";
import { CHESS_PUZZLES } from "../../data/puzzles";
import {
  SolverPage,
  PuzzleDescription,
  PuzzleControls,
  HintButton,
  ResetButton,
  HintContainer,
  HintText,
  GameComplete,
  PuzzleCompleteButtons,
  NextPuzzleButton,
} from "./styles";
import { PageTitle } from "src/components/PageTitle/PageTitle";
import { BackButtonWrap } from "src/components/BackButtonImage/styles";
import BackButtonImage from "src/components/BackButtonImage/BackButtonImage";

export function PuzzleSolver() {
  const { categoryId, puzzleId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const previousPage = location.pathname.split("/").slice(0, -1).join("/");

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
    return <div>Task not found</div>;
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
    <SolverPage>
      <PageTitle title={puzzle.title} />
      <BackButtonWrap>
        <BackButtonImage linkToPage={previousPage} />
      </BackButtonWrap>
      <PuzzleDescription>
        <p>{puzzle.description}</p>
      </PuzzleDescription>
      <ChessPuzzleBoard
        key={key}
        initialPosition={puzzle.initialPosition}
        correctMoves={puzzle.correctMoves}
        onComplete={handleComplete}
      />
      <PuzzleControls>
        <HintButton onClick={() => setShowHint(!showHint)}>
          {showHint ? "Hide hint" : "Show hint"}
        </HintButton>
        <ResetButton onClick={handleReset}>Start over</ResetButton>
      </PuzzleControls>
      {showHint && (
        <HintContainer>
          <HintText>{puzzle.hint}</HintText>
        </HintContainer>
      )}
      {gameComplete && (
        <GameComplete>
          <h2>Task solved!</h2>
          <PuzzleCompleteButtons>
            {hasNextPuzzle ? (
              <NextPuzzleButton onClick={handleNextPuzzle}>
                Next task
              </NextPuzzleButton>
            ) : (
              <NextPuzzleButton
                onClick={() => navigate(`/puzzles/${categoryId}`)}
              >
                Back to task list
              </NextPuzzleButton>
            )}
          </PuzzleCompleteButtons>
        </GameComplete>
      )}
    </SolverPage>
  );
}
