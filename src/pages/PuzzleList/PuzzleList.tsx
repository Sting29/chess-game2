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
    (id: string) => navigate(`/puzzles/${id}`),
    [navigate]
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
          CHESS_PUZZLES.map((category) => (
            <PuzzleBoardButton
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
            >
              <PuzzleCategory>
                <PuzzleCategoryTitle>
                  {t(category.titleKey)}
                </PuzzleCategoryTitle>
                <PuzzleCategoryDescriptionWrap>
                  <PuzzleCategoryDescription>
                    {t(category.descriptionKey)}
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
              href={`/puzzles/${category.id}/${puzzle.id}`}
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
