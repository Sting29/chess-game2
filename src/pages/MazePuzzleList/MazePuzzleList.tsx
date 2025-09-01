import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useMemo } from "react";
import { MAZE_PUZZLES } from "../../data/mazePuzzles";
import { selectMazeProgress } from "../../store/mazeProgressSlice";
import {
  TutorialPage,
  PuzzleCategories,
  PuzzleItem,
} from "../PuzzleList/styles";
import { BackButtonWrap } from "src/components/BackButtonImage/styles";
import { PageTitle } from "src/components/PageTitle/PageTitle";
import BackButtonImage from "src/components/BackButtonImage/BackButtonImage";
import { useTranslation } from "react-i18next";
import { useProgress } from "src/hooks/useProgress";
import { RootState } from "src/store";

function MazePuzzleList() {
  const { t } = useTranslation();
  const location = useLocation();

  const mazeProgress = useSelector(selectMazeProgress);
  const previousPage = location.pathname.split("/").slice(0, -1).join("/");

  // Load progress data from the new progress system
  const { getProgressByCategory, ensureFreshData } = useProgress();

  // Get completed puzzles from the new progress system
  const completedPuzzles = useMemo(() => {
    const categoryProgress = getProgressByCategory("maze");
    return categoryProgress.length > 0 ? categoryProgress[0].completed : [];
  }, [getProgressByCategory]);

  // Load progress data when component mounts
  useEffect(() => {
    ensureFreshData();
  }, [ensureFreshData]);

  // Function to determine if a puzzle is available (unlocked)
  const isPuzzleAvailable = (puzzleIndex: number): boolean => {
    // First puzzle is always available
    if (puzzleIndex === 0) return true;

    // Other puzzles are available only if previous puzzle is completed
    const previousPuzzleId = puzzleIndex.toString(); // Previous puzzle ID
    return completedPuzzles.includes(previousPuzzleId);
  };

  return (
    <TutorialPage>
      <PageTitle title={t("maze_puzzles")} />
      <BackButtonWrap>
        <BackButtonImage linkToPage={previousPage} />
      </BackButtonWrap>

      <PuzzleCategories>
        {MAZE_PUZZLES.map((puzzle, index) => {
          const isCompleted = completedPuzzles.includes(puzzle.id);
          const isAvailable = isPuzzleAvailable(index);
          const isLocked = !isAvailable;

          return (
            <PuzzleItem
              key={puzzle.id}
              to={isLocked ? "#" : `/puzzles/maze/${puzzle.id}`}
              style={{
                backgroundColor: isCompleted
                  ? "#e8f5e8"
                  : isLocked
                  ? "#f0f0f0"
                  : "#f7f7f7",
                border: isCompleted ? "2px solid #4caf50" : "none",
                opacity: isLocked ? 0.6 : 1,
                cursor: isLocked ? "not-allowed" : "pointer",
              }}
              onClick={(e) => {
                if (isLocked) {
                  e.preventDefault();
                }
              }}
            >
              <h3>
                {t(puzzle.titleKey)} {puzzle.id}
                {isCompleted && (
                  <span style={{ color: "#4caf50", marginLeft: "8px" }}>✓</span>
                )}
                {isLocked && (
                  <span style={{ color: "#999", marginLeft: "8px" }}>🔒</span>
                )}
              </h3>
              <p>{t(puzzle.descriptionKey)}</p>
              {isLocked && (
                <p
                  style={{
                    color: "#999",
                    fontSize: "0.85rem",
                    fontStyle: "italic",
                  }}
                >
                  {t("complete_previous_puzzle_to_unlock")}
                </p>
              )}
              {(puzzle.maxMoves || puzzle.timeLimit) && (
                <div
                  style={{
                    marginTop: "8px",
                    fontSize: "0.85rem",
                    color: "#888",
                    display: "flex",
                    gap: "12px",
                  }}
                >
                  {puzzle.maxMoves && (
                    <span>
                      📊 {t("max_moves")}: {puzzle.maxMoves}
                    </span>
                  )}
                  {puzzle.timeLimit && (
                    <span>
                      ⏱️ {t("time_limit")}: {Math.floor(puzzle.timeLimit / 60)}:
                      {(puzzle.timeLimit % 60).toString().padStart(2, "0")}
                    </span>
                  )}
                </div>
              )}
            </PuzzleItem>
          );
        })}
      </PuzzleCategories>
    </TutorialPage>
  );
}

export default MazePuzzleList;
