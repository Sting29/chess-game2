import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { ChessPuzzleBoard } from "src/components/ChessPuzzleBoard/ChessPuzzleBoard";
import { CHESS_PUZZLES } from "src/data/puzzles";
import { ChessPuzzle } from "src/types/types";
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
import { useTranslation } from "react-i18next";
import { useProgressTracking } from "src/hooks/useProgressTracking";
import { ProgressCategory } from "src/api/types/progress";
import { RootState } from "src/store";

export function PuzzleSolver() {
  const { t } = useTranslation();
  const { categoryId, puzzleId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Получаем номер страницы из query параметра
  const currentPageNumber = useMemo(() => {
    const pageParam = searchParams.get("page");
    if (pageParam) {
      const page = parseInt(pageParam, 10);
      return isNaN(page) || page < 1 ? 1 : page;
    }
    return 1;
  }, [searchParams]);

  const previousPage = useMemo(() => {
    return categoryId
      ? `/puzzles/${categoryId}?page=${currentPageNumber}`
      : "/puzzles";
  }, [categoryId, currentPageNumber]);

  const [showHint, setShowHint] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [key, setKey] = useState(0); // Ключ для форсированного перерендера доски

  // Get current user from Redux store
  const currentUser = useSelector((state: RootState) => state.settings.user);
  const isAuthenticated = useSelector(
    (state: RootState) => state.settings.isAuthenticated
  );

  // Initialize progress tracking
  const { trackPuzzleCompletion } = useProgressTracking({
    categoryId: categoryId as ProgressCategory,
    userId: currentUser?.id || "anonymous-user", // Use actual user ID or fallback
    type: "tutorial",
  });

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

  // Type guard to check if puzzle is a ChessPuzzle
  const isChessPuzzle = (puzzle: any): puzzle is ChessPuzzle => {
    return puzzle && "correctMoves" in puzzle && "playerColor" in puzzle;
  };

  if (!puzzle || !isChessPuzzle(puzzle)) {
    console.error("Chess puzzle not found:", {
      categoryId,
      puzzleId,
      availableCategories: CHESS_PUZZLES.map((c) => c.id),
    });
    return (
      <div>
        <h2>{t("task_not_found")}</h2>
        <p>Category: {categoryId}</p>
        <p>Puzzle: {puzzleId}</p>
        <button onClick={() => navigate("/puzzles")}>Back to Puzzles</button>
      </div>
    );
  }

  const handleComplete = async (result: "success" | "failure") => {
    if (result === "success") {
      setGameComplete(true);

      // Track puzzle completion only if user is authenticated
      if (puzzleId && isAuthenticated && currentUser?.id) {
        await trackPuzzleCompletion(puzzleId);
      }
    }
  };

  const handleReset = () => {
    setGameComplete(false);
    setShowHint(false);
    setKey((prev) => prev + 1); // Изменение ключа вызовет перерендер доски
  };

  const handleNextPuzzle = () => {
    if (nextPuzzle) {
      navigate(
        `/puzzles/${categoryId}/${nextPuzzle.id}?page=${currentPageNumber}`
      );
    } else {
      navigate(`/puzzles/${categoryId}?page=${currentPageNumber}`);
    }
  };

  return (
    <SolverPage>
      <PageTitle title={`${t(puzzle.titleKey)}${puzzleId}`} />
      <BackButtonWrap>
        <BackButtonImage linkToPage={previousPage} />
      </BackButtonWrap>
      <PuzzleDescription>
        <p>{t(puzzle.descriptionKey)}</p>
      </PuzzleDescription>
      <ChessPuzzleBoard
        key={key}
        initialPosition={puzzle.initialPosition}
        correctMoves={puzzle.correctMoves}
        onComplete={handleComplete}
        playerColor={puzzle.playerColor}
      />
      <PuzzleControls>
        <HintButton onClick={() => setShowHint(!showHint)}>
          {showHint ? t("hide_hint") : t("show_hint")}
        </HintButton>
        <ResetButton onClick={handleReset}>{t("start_over")}</ResetButton>
      </PuzzleControls>
      {showHint && (
        <HintContainer>
          <HintText>{t(puzzle.hintKey)}</HintText>
        </HintContainer>
      )}
      {gameComplete && (
        <GameComplete>
          <h2>{t("task_solved")}</h2>
          <PuzzleCompleteButtons>
            {hasNextPuzzle ? (
              <NextPuzzleButton onClick={handleNextPuzzle}>
                {t("next_task")}
              </NextPuzzleButton>
            ) : (
              <NextPuzzleButton
                onClick={() =>
                  navigate(`/puzzles/${categoryId}?page=${currentPageNumber}`)
                }
              >
                {t("back_to_task_list")}
              </NextPuzzleButton>
            )}
          </PuzzleCompleteButtons>
        </GameComplete>
      )}
    </SolverPage>
  );
}
