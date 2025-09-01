import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { MazeBoard } from "src/components/MazeBoard/MazeBoard";
import { MAZE_PUZZLES } from "src/data/mazePuzzles";
import {
  completePuzzle,
  setCurrentPuzzle,
  selectIsPuzzleCompleted,
} from "src/store/mazeProgressSlice";
import { RootState } from "src/store";
import {
  SolverPage,
  PuzzleDescription,
  GameComplete,
  PuzzleCompleteButtons,
  NextPuzzleButton,
} from "./styles";
import { PageTitle } from "src/components/PageTitle/PageTitle";
import { BackButtonWrap } from "src/components/BackButtonImage/styles";
import BackButtonImage from "src/components/BackButtonImage/BackButtonImage";
import { useTranslation } from "react-i18next";
import { useProgressTracking } from "src/hooks/useProgressTracking";

export function MazePuzzleSolver() {
  const { t } = useTranslation();
  const { puzzleId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const previousPage = location.pathname.split("/").slice(0, -1).join("/");

  const [showHints, setShowHints] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [key, setKey] = useState(0); // Key for forced board re-render

  const isPuzzleCompleted = useSelector((state: RootState) =>
    selectIsPuzzleCompleted(puzzleId || "")(state)
  );

  // Get current user from Redux store
  const currentUser = useSelector((state: RootState) => state.settings.user);
  const isAuthenticated = useSelector(
    (state: RootState) => state.settings.isAuthenticated
  );

  // Initialize progress tracking for maze category
  const { trackPuzzleCompletion } = useProgressTracking({
    categoryId: "maze",
    userId: currentUser?.id || "anonymous-user",
    type: "tutorial",
  });

  // Reset state when puzzleId changes
  useEffect(() => {
    setShowHints(false);
    setGameComplete(false);
    setKey((prev) => prev + 1);

    if (puzzleId) {
      dispatch(setCurrentPuzzle(puzzleId));
    }
  }, [puzzleId, dispatch]);

  const currentPuzzleIndex = MAZE_PUZZLES.findIndex((p) => p.id === puzzleId);
  const puzzle = MAZE_PUZZLES[currentPuzzleIndex];
  const hasNextPuzzle = currentPuzzleIndex < MAZE_PUZZLES.length - 1;
  const nextPuzzle = hasNextPuzzle
    ? MAZE_PUZZLES[currentPuzzleIndex + 1]
    : null;

  if (!puzzle) {
    console.error("Maze puzzle not found:", {
      puzzleId,
      availablePuzzles: MAZE_PUZZLES.map((p) => p.id),
    });
    return (
      <SolverPage>
        <PageTitle title={t("task_not_found")} />
        <BackButtonWrap>
          <BackButtonImage linkToPage="/puzzles/maze" />
        </BackButtonWrap>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <h2>{t("task_not_found")}</h2>
          <p>Puzzle ID: {puzzleId}</p>
          <button
            onClick={() => navigate("/puzzles/maze")}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "#4A90E2",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              marginTop: "1rem",
            }}
          >
            {t("back_to_maze_puzzles")}
          </button>
        </div>
      </SolverPage>
    );
  }

  const handleComplete = async (result: "success" | "failure") => {
    if (result === "success") {
      setGameComplete(true);

      if (puzzleId) {
        console.log("Maze puzzle completed:", puzzleId);
        console.log("Is authenticated:", isAuthenticated);
        console.log("Current user ID:", currentUser?.id);
        console.log("Is puzzle already completed:", isPuzzleCompleted);

        // Always update local maze progress
        if (!isPuzzleCompleted) {
          dispatch(completePuzzle(puzzleId));
        }

        // Always track puzzle completion in progress system if user is authenticated
        if (isAuthenticated && currentUser?.id) {
          console.log(
            "Calling trackPuzzleCompletion for maze puzzle:",
            puzzleId
          );
          await trackPuzzleCompletion(puzzleId);
        } else {
          console.log(
            "Skipping progress tracking - user not authenticated or no user ID"
          );
        }
      }
    }
  };

  const handleRestart = () => {
    setGameComplete(false);
    setShowHints(false);
    setKey((prev) => prev + 1); // Changing key will cause board re-render
  };

  const handleToggleHints = () => {
    setShowHints((prev) => !prev);
  };

  const handleNextPuzzle = () => {
    if (nextPuzzle) {
      navigate(`/puzzles/maze/${nextPuzzle.id}`);
    } else {
      navigate("/puzzles/maze");
    }
  };

  return (
    <SolverPage>
      <PageTitle title={`${t(puzzle.titleKey)} ${puzzleId}`} />
      <BackButtonWrap>
        <BackButtonImage linkToPage={previousPage} />
      </BackButtonWrap>

      <PuzzleDescription>
        <p>{t(puzzle.descriptionKey)}</p>
        {puzzle.maxMoves && (
          <p>{t("max_moves_allowed", { count: puzzle.maxMoves })}</p>
        )}
        {puzzle.timeLimit && (
          <p>{t("time_limit", { time: Math.floor(puzzle.timeLimit / 60) })}</p>
        )}
      </PuzzleDescription>

      <MazeBoard
        key={key}
        puzzle={puzzle}
        onComplete={handleComplete}
        showHints={showHints}
        onToggleHints={handleToggleHints}
        onRestart={handleRestart}
      />

      {gameComplete && (
        <GameComplete>
          <h2>{t("maze_complete")}</h2>
          <p>{t("congratulations_maze_solved")}</p>
          <PuzzleCompleteButtons>
            {hasNextPuzzle ? (
              <NextPuzzleButton onClick={handleNextPuzzle}>
                {t("next_maze")}
              </NextPuzzleButton>
            ) : (
              <NextPuzzleButton onClick={() => navigate("/puzzles/maze")}>
                {t("back_to_maze_list")}
              </NextPuzzleButton>
            )}
          </PuzzleCompleteButtons>
        </GameComplete>
      )}
    </SolverPage>
  );
}
