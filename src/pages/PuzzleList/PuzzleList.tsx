import { useLocation, useNavigate, useParams } from "react-router-dom";
import { CHESS_PUZZLES } from "../../data/puzzles";
import {
  TutorialPage,
  PuzzleCategories,
  PuzzleBoardButton,
  PuzzleListWrap,
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

  // Если categoryId не указан, показываем список категорий
  if (!categoryId) {
    return (
      <TutorialPage>
        <PageTitle title="Chess puzzles" />
        <BackButtonWrap>
          <BackButtonImage linkToPage={previousPage} />
        </BackButtonWrap>
        <PuzzleCategories>
          {CHESS_PUZZLES.map((category) => (
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
          ))}
        </PuzzleCategories>
      </TutorialPage>
    );
  }

  // Показываем список задач в выбранной категории
  const category = CHESS_PUZZLES.find((c) => c.id === categoryId);
  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    <TutorialPage>
      <PageTitle title={category.title} />
      <BackButtonWrap>
        <BackButtonImage linkToPage={previousPage} />
      </BackButtonWrap>
      <PuzzleListWrap>
        {category.puzzles.map((puzzle) => (
          <PuzzleItem
            key={puzzle.id}
            onClick={() => navigate(`/puzzles/${categoryId}/${puzzle.id}`)}
          >
            <h3>{puzzle.title}</h3>
            <p>{puzzle.description}</p>
          </PuzzleItem>
        ))}
      </PuzzleListWrap>
    </TutorialPage>
  );
}

export default PuzzleList;
