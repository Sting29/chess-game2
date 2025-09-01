import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useMemo, useEffect } from "react";
import { CHESS_PUZZLES } from "../../data/puzzles";
import { BackButtonWrap } from "src/components/BackButtonImage/styles";
import { PageTitle } from "src/components/PageTitle/PageTitle";
import BackButtonImage from "src/components/BackButtonImage/BackButtonImage";
import { useTranslation } from "react-i18next";
import { getBackgroundConfig, getCategoryImage } from "./config";
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
import { useProgress } from "src/hooks/useProgress";

function PuzzleCategory() {
  const { t } = useTranslation();
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Load progress data
  const { getProgressByCategory, ensureFreshData } = useProgress();

  // Get completed puzzles for this category
  const completedPuzzles = useMemo(() => {
    if (!categoryId) return [];
    const categoryProgress = getProgressByCategory(categoryId);
    return categoryProgress.length > 0 ? categoryProgress[0].completed : [];
  }, [categoryId, getProgressByCategory]);

  // Load progress data when component mounts
  useEffect(() => {
    ensureFreshData();
  }, [ensureFreshData]);

  // Получаем номер страницы из query параметра или устанавливаем по умолчанию
  const currentPageFromUrl = useMemo(() => {
    const pageParam = searchParams.get("page");
    if (pageParam) {
      const page = parseInt(pageParam, 10);
      return isNaN(page) || page < 1 ? 1 : page;
    }
    return 1;
  }, [searchParams]);

  // Если нет page в query параметрах, устанавливаем page=1
  useEffect(() => {
    if (categoryId && !searchParams.get("page")) {
      setSearchParams({ page: "1" }, { replace: true });
      return;
    }
  }, [categoryId, searchParams, setSearchParams]);

  const previousPage = useMemo(() => {
    return "/puzzles";
  }, []);

  const category = useMemo(
    () => CHESS_PUZZLES.find((c) => c.id === categoryId),
    [categoryId]
  );

  // Функция для изменения страницы через query параметр
  const handlePageChange = (pageNumber: number) => {
    setSearchParams({ page: pageNumber.toString() });
  };

  const {
    currentPagePuzzles,
    canGoForward,
    canGoBackward,
    goToNextPage,
    goToPreviousPage,
    currentPage,
  } = usePagination(category, currentPageFromUrl, handlePageChange);

  // Get configuration based on current page (following spec: Math.floor(currentPuzzleIndex / 10))
  const backgroundConfig = useMemo(() => {
    const firstPuzzleIndex = (currentPage - 1) * 10; // First puzzle index on current page (0-based)
    const backgroundIndex = Math.floor(firstPuzzleIndex / 10);
    return getBackgroundConfig(backgroundIndex);
  }, [currentPage]);

  // Get category image based on categoryId
  const categoryImage = useMemo(() => {
    return categoryId ? getCategoryImage(categoryId) : "";
  }, [categoryId]);

  const handleStoneClick = (
    puzzleId: string,
    state: "completed" | "available" | "locked"
  ) => {
    // Only allow navigation for completed and available stones
    if (category && state !== "locked") {
      navigate(
        `/puzzles/${category.id}/${puzzleId}?page=${currentPageFromUrl}`
      );
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
    <PuzzleMapContainer $backgroundImage={backgroundConfig.background}>
      <PageTitle title={t(category.titleKey)} />
      <BackButtonWrap>
        <BackButtonImage linkToPage={previousPage} />
      </BackButtonWrap>

      {/* Decorative Elements */}
      <DecorativeContainer>
        {backgroundConfig.decorativeElements.map(
          (element, index) =>
            element.show && (
              <DecorativeElement
                key={`${element.name}-${index}`}
                type={element.name.replace(".png", "") as any}
                position={{ x: element.x, y: element.y }}
                size={{ width: element.width, height: element.height }}
                puzzleId={backgroundConfig.id}
                imageName={element.name}
                zIndex={element.zIndex}
              />
            )
        )}

        {/* Category Image (compass, etc.) */}
        {backgroundConfig.categoryImagePosition.show && categoryImage && (
          <DecorativeElement
            type={"compass" as any}
            position={{
              x: backgroundConfig.categoryImagePosition.x,
              y: backgroundConfig.categoryImagePosition.y,
            }}
            size={{
              width: backgroundConfig.categoryImagePosition.width,
              height: backgroundConfig.categoryImagePosition.height,
            }}
            customImage={categoryImage}
            zIndex={backgroundConfig.categoryImagePosition.zIndex}
          />
        )}
      </DecorativeContainer>

      {/* Track Container with Puzzle Stones */}
      <TrackContainer
        $trackImage={backgroundConfig.track}
        $trackSize={backgroundConfig.trackSize}
      >
        {currentPagePuzzles.map((puzzle, index) => {
          const position = getStonePosition(index, backgroundConfig);
          const globalPuzzleIndex = (currentPage - 1) * 10 + index; // Calculate global puzzle index
          const state = getPuzzleState(globalPuzzleIndex, completedPuzzles);

          return (
            <StoneWrapper key={puzzle.id} $position={position}>
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
