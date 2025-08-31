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

function PuzzleCategory() {
  const { t } = useTranslation();
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

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

  // Get configuration based on current page
  const backgroundConfig = useMemo(() => {
    return getBackgroundConfig(currentPage - 1); // Convert from 1-based to 0-based
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
          />
        )}
      </DecorativeContainer>

      {/* Track Container with Puzzle Stones */}
      <TrackContainer $trackImage={backgroundConfig.track}>
        {currentPagePuzzles.map((puzzle, index) => {
          const position = getStonePosition(index, backgroundConfig);
          const state = getPuzzleState(index);

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
