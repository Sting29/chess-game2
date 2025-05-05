import { useNavigate, useParams } from "react-router-dom";
import { CHESS_PUZZLES } from "../../data/puzzles";
import {
  TutorialPage,
  PuzzleCategories,
  PuzzleCategory,
  PuzzleCount,
  PuzzleListWrap,
  PuzzleItem,
} from "./styles";
import { BackButtonWrap } from "src/styles/commonStyles";

import { PageTitle } from "src/components/PageTitle/PageTitle";
import BackButtonImage from "src/components/BackButtonImage/BackButtonImage";

function PuzzleList() {
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const previousPage = "/";

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
            <PuzzleCategory
              key={category.id}
              onClick={() => navigate(`/puzzles/${category.id}`)}
            >
              <h2>{category.title}</h2>
              <p>{category.description}</p>
              <PuzzleCount>Tasks: {category.puzzles.length}</PuzzleCount>
            </PuzzleCategory>
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
