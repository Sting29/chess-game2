import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
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

function MazePuzzleList() {
  const { t } = useTranslation();
  const location = useLocation();

  const mazeProgress = useSelector(selectMazeProgress);
  const previousPage = location.pathname.split("/").slice(0, -1).join("/");

  return (
    <TutorialPage>
      <PageTitle title={t("maze_puzzles")} />
      <BackButtonWrap>
        <BackButtonImage linkToPage={previousPage} />
      </BackButtonWrap>

      <PuzzleCategories>
        {MAZE_PUZZLES.map((puzzle) => {
          const isCompleted = mazeProgress.completedPuzzles.includes(puzzle.id);

          return (
            <PuzzleItem
              key={puzzle.id}
              to={`/puzzles/maze/${puzzle.id}`}
              style={{
                backgroundColor: isCompleted ? "#e8f5e8" : "#f7f7f7",
                border: isCompleted ? "2px solid #4caf50" : "none",
              }}
            >
              <h3>
                {t(puzzle.titleKey)} {puzzle.id}
                {isCompleted && (
                  <span style={{ color: "#4caf50", marginLeft: "8px" }}>✓</span>
                )}
              </h3>
              <p>{t(puzzle.descriptionKey)}</p>
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
