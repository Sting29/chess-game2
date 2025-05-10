import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useMemo, useCallback } from "react";
import { CHESS_PUZZLES } from "../../data/puzzles";
import {
  TutorialPage,
  PuzzleCategories,
  PuzzleBoardButton,
  // PuzzleListWrap,
  PuzzleItem,
  PuzzleCount,
  PuzzleCategory,
  PuzzleCategoryTitle,
  PuzzleCategoryDescriptionWrap,
  PuzzleCategoryDescription,
  PuzzleCountText,
} from "./styles";
import { BackButtonWrap } from "src/components/BackButtonImage/styles";
import Image from "src/components/Image/Image";
import { PageTitle } from "src/components/PageTitle/PageTitle";
import BackButtonImage from "src/components/BackButtonImage/BackButtonImage";
import { useTranslation } from "react-i18next";

function PuzzleList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const location = useLocation();
  const previousPage = useMemo(
    () =>
      categoryId ? location.pathname.split("/").slice(0, -1).join("/") : "-1",
    [categoryId, location.pathname]
  );

  const category = useMemo(
    () => CHESS_PUZZLES.find((c) => c.id === categoryId),
    [categoryId]
  );

  const handleCategoryClick = useCallback(
    (id: string) => navigate(`/puzzles/${id}`),
    [navigate]
  );

  const handlePuzzleClick = useCallback(
    (puzzleId: string) => navigate(`/puzzles/${categoryId}/${puzzleId}`),
    [navigate, categoryId]
  );
  // Если categoryId не указан, показываем список категорий

  return (
    <TutorialPage>
      <PageTitle title={!categoryId ? t("chess_puzzles") : category?.title} />
      <BackButtonWrap>
        <BackButtonImage linkToPage={previousPage} />
      </BackButtonWrap>
      <PuzzleCategories>
        {!categoryId ? (
          CHESS_PUZZLES.map((category) => (
            <PuzzleBoardButton
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
            >
              <PuzzleCategory>
                <PuzzleCategoryTitle>{category.title}</PuzzleCategoryTitle>
                <PuzzleCategoryDescriptionWrap>
                  <PuzzleCategoryDescription>
                    {category.description}
                  </PuzzleCategoryDescription>
                  <PuzzleCount>
                    <PuzzleCountText>
                      {t("tasks")}: {category.puzzles.length}
                    </PuzzleCountText>
                  </PuzzleCount>
                </PuzzleCategoryDescriptionWrap>
              </PuzzleCategory>
              <Image src={category.image} alt="" width={100} height={100} />
            </PuzzleBoardButton>
          ))
        ) : !category ? (
          <PuzzleCategoryTitle>{t("category_not_found")}</PuzzleCategoryTitle>
        ) : (
          category.puzzles.map((puzzle) => (
            <PuzzleItem
              key={puzzle.id}
              onClick={() => handlePuzzleClick(puzzle.id)}
            >
              <h3>{puzzle.title}</h3>
              <p>{puzzle.description}</p>
            </PuzzleItem>
          ))
        )}
      </PuzzleCategories>
    </TutorialPage>
  );
}

export default PuzzleList;
