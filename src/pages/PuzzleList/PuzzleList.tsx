import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useMemo, useCallback } from "react";
import { CHESS_PUZZLES } from "../../data/puzzles";
import {
  TutorialPage,
  PuzzleCategories,
  // PuzzleListWrap,
  PuzzleItem,
  PuzzleCategoryTitle,
} from "./styles";
import { BackButtonWrap } from "src/components/BackButtonImage/styles";
import { PageTitle } from "src/components/PageTitle/PageTitle";
import BackButtonImage from "src/components/BackButtonImage/BackButtonImage";
import { useTranslation } from "react-i18next";
import TutorialSlider from "src/components/TutorialSlider/TutorialSlider";
import { useBreakpoint } from "src/hooks/useBreakpoint";
import PuzzleCategoryCard from "src/components/PuzzleCategoryCard/PuzzleCategoryCard";

const visibleCountMap = {
  mobile: 1,
  tablet: 2,
  laptop: 2,
  desktop: 3,
  fullHD: 3,
};

function PuzzleList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const location = useLocation();
  const { breakpoint } = useBreakpoint();

  const visibleCount = Math.min(3, visibleCountMap[breakpoint] ?? 3);

  // const prevPageLink = () => {
  //   console.log(location.pathname);
  //   if (location.pathname === "/puzzles") {
  //     return "/";
  //   }
  //   return previousPage;
  // };

  const previousPage = useMemo(() => {
    if (location.pathname === "/puzzles") {
      return "/";
    }
    return categoryId
      ? location.pathname.split("/").slice(0, -1).join("/")
      : "-1";
  }, [categoryId, location.pathname]);

  const category = useMemo(
    () => CHESS_PUZZLES.find((c) => c.id === categoryId),
    [categoryId]
  );

  const handleCategoryClick = useCallback(
    (id: string) => {
      if (id === "maze") {
        navigate("/puzzles/maze");
      } else {
        navigate(`/puzzles/${id}`);
      }
    },
    // navigate is stable from useNavigate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Если categoryId не указан, показываем список категорий

  return (
    <TutorialPage>
      <PageTitle
        title={
          !categoryId
            ? t("chess_puzzles")
            : category
            ? t(category.titleKey)
            : ""
        }
      />
      <BackButtonWrap>
        <BackButtonImage linkToPage={previousPage} />
      </BackButtonWrap>
      <PuzzleCategories>
        {!categoryId ? (
          <TutorialSlider visibleCount={visibleCount} direction="vertical">
            {CHESS_PUZZLES.map((category) => (
              <PuzzleCategoryCard
                key={category.id}
                category={category}
                onClick={handleCategoryClick}
              />
            ))}
          </TutorialSlider>
        ) : !category ? (
          <PuzzleCategoryTitle>{t("category_not_found")}</PuzzleCategoryTitle>
        ) : (
          category.puzzles.map((puzzle) => (
            <PuzzleItem
              key={puzzle.id}
              to={`/puzzles/${category.id}/${puzzle.id}`}
            >
              <h3>
                {t(puzzle.titleKey)}
                {puzzle.id}
              </h3>
              <p>{t(puzzle.descriptionKey)}</p>
            </PuzzleItem>
          ))
        )}
      </PuzzleCategories>
    </TutorialPage>
  );
}

export default PuzzleList;
