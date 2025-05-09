import { useLocation, useNavigate, useParams } from "react-router-dom";
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

function PuzzleList() {
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const location = useLocation();
  const previousPage = location.pathname.split("/").slice(0, -1).join("/");
  const category = CHESS_PUZZLES.find((c) => c.id === categoryId);

  // Если categoryId не указан, показываем список категорий

  return (
    <TutorialPage>
      <PageTitle title={!categoryId ? "Chess Puzzles" : category?.title} />
      <BackButtonWrap>
        <BackButtonImage linkToPage={previousPage} />
      </BackButtonWrap>
      <PuzzleCategories>
        {!categoryId ? (
          CHESS_PUZZLES.map((category) => (
            <PuzzleBoardButton
              key={category.id}
              onClick={() => navigate(`/puzzles/${category.id}`)}
            >
              <PuzzleCategory>
                <PuzzleCategoryTitle>{category.title}</PuzzleCategoryTitle>
                <PuzzleCategoryDescriptionWrap>
                  <PuzzleCategoryDescription>
                    {category.description}
                  </PuzzleCategoryDescription>
                  <PuzzleCount>
                    <PuzzleCountText>
                      Tasks: {category.puzzles.length}
                    </PuzzleCountText>
                  </PuzzleCount>
                </PuzzleCategoryDescriptionWrap>
              </PuzzleCategory>
              <Image src={category.image} alt="" width={100} height={100} />
            </PuzzleBoardButton>
          ))
        ) : !category ? (
          <PuzzleCategoryTitle>Category not found</PuzzleCategoryTitle>
        ) : (
          category.puzzles.map((puzzle) => (
            <PuzzleItem
              key={puzzle.id}
              onClick={() => navigate(`/puzzles/${categoryId}/${puzzle.id}`)}
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
