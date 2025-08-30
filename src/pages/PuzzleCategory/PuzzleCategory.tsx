import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useMemo, useEffect } from "react";
import { CHESS_PUZZLES } from "../../data/puzzles";
import { BackButtonWrap } from "src/components/BackButtonImage/styles";
import { PageTitle } from "src/components/PageTitle/PageTitle";
import BackButtonImage from "src/components/BackButtonImage/BackButtonImage";
import { useTranslation } from "react-i18next";
import {
  PuzzleMapContainer,
  TrackContainer,
  StoneWrapper,
  NavigationContainer,
  DecorativeContainer,
} from "./styles";
import { getStonePosition, getPuzzleState } from "./utils";
import { usePagination } from "./hooks";
import PuzzleStone from "./components/PuzzleStone/PuzzleStone";
import NavigationButton from "./components/NavigationButton";
import DecorativeElement from "./components/DecorativeElement/DecorativeElement";

function PuzzleCategory() {
  const { t } = useTranslation();
  const { categoryId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const previousPage = useMemo(() => {
    return categoryId
      ? location.pathname.split("/").slice(0, -1).join("/")
      : "/puzzles";
  }, [categoryId, location.pathname]);

  const category = useMemo(
    () => CHESS_PUZZLES.find((c) => c.id === categoryId),
    [categoryId]
  );

  const {
    currentPagePuzzles,
    canGoForward,
    canGoBackward,
    goToNextPage,
    goToPreviousPage,
    resetPagination,
  } = usePagination(category);

  // Reset pagination when category changes
  useEffect(() => {
    resetPagination();
  }, [categoryId, resetPagination]);

  const handleStoneClick = (
    puzzleId: string,
    state: "completed" | "available" | "locked"
  ) => {
    // Only allow navigation for completed and available stones
    if (category && state !== "locked") {
      navigate(`/puzzles/${category.id}/${puzzleId}`);
    }
  };

  if (!category) {
    return (
      <PuzzleMapContainer>
        <PageTitle title={t("category_not_found")} />
        <BackButtonWrap>
          <BackButtonImage linkToPage={previousPage} />
        </BackButtonWrap>
      </PuzzleMapContainer>
    );
  }

  return (
    <PuzzleMapContainer>
      <PageTitle title={t(category.titleKey)} />
      <BackButtonWrap>
        <BackButtonImage linkToPage={previousPage} />
      </BackButtonWrap>

      {/* Decorative Elements */}
      <DecorativeContainer>
        <DecorativeElement type="anchor" position={{ x: 85, y: 15 }} />
        <DecorativeElement type="compass" position={{ x: 85, y: 85 }} />
        <DecorativeElement type="stone_left" position={{ x: 5, y: 50 }} />
        <DecorativeElement type="stone_right" position={{ x: 95, y: 50 }} />
        <DecorativeElement type="bone" position={{ x: 20, y: 20 }} />
        <DecorativeElement type="coins" position={{ x: 75, y: 25 }} />
        <DecorativeElement type="map" position={{ x: 15, y: 75 }} />
      </DecorativeContainer>

      {/* Track Container with Puzzle Stones */}
      <TrackContainer>
        {currentPagePuzzles.map((puzzle, index) => {
          const position = getStonePosition(index);
          const state = getPuzzleState(index);

          return (
            <StoneWrapper key={puzzle.id} position={position}>
              <PuzzleStone
                puzzleNumber={puzzle.puzzleNumber}
                state={state}
                onClick={() => handleStoneClick(puzzle.id, state)}
              />
            </StoneWrapper>
          );
        })}
      </TrackContainer>

      {/* Navigation Buttons */}
      <NavigationContainer>
        <NavigationButton
          direction="backward"
          disabled={!canGoBackward}
          onClick={goToPreviousPage}
        />
        <NavigationButton
          direction="forward"
          disabled={!canGoForward}
          onClick={goToNextPage}
        />
      </NavigationContainer>
    </PuzzleMapContainer>
  );
}

export default PuzzleCategory;
