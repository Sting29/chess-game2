import { useLocation, useParams } from "react-router-dom";
import { useMemo } from "react";
import { CHESS_PUZZLES } from "../../data/puzzles";
import {
  TutorialPage,
  PuzzleCategories,
  PuzzleItem,
  PuzzleCategoryTitle,
} from "../PuzzleList/styles";
import { BackButtonWrap } from "src/components/BackButtonImage/styles";
import { PageTitle } from "src/components/PageTitle/PageTitle";
import BackButtonImage from "src/components/BackButtonImage/BackButtonImage";
import { useTranslation } from "react-i18next";

function PuzzleCategory() {
  const { t } = useTranslation();
  const { categoryId } = useParams();
  const location = useLocation();

  const previousPage = useMemo(() => {
    return categoryId
      ? location.pathname.split("/").slice(0, -1).join("/")
      : "/puzzles";
  }, [categoryId, location.pathname]);

  const category = useMemo(
    () => CHESS_PUZZLES.find((c) => c.id === categoryId),
    [categoryId]
  );

  return (
    <TutorialPage>
      <PageTitle
        title={category ? t(category.titleKey) : t("category_not_found")}
      />
      <BackButtonWrap>
        <BackButtonImage linkToPage={previousPage} />
      </BackButtonWrap>
      <PuzzleCategories>
        {!category ? (
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

export default PuzzleCategory;
