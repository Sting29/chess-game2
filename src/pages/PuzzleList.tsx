import { useNavigate, useParams } from "react-router-dom";
import { CHESS_PUZZLES } from "../data/puzzles";
import BackButton from "../components/BackButton/BackButton";

function PuzzleList() {
  const navigate = useNavigate();
  const { categoryId } = useParams();

  // Если categoryId не указан, показываем список категорий
  if (!categoryId) {
    return (
      <div className="tutorial-page">
        <h1>Chess puzzles</h1>
        <BackButton linkToPage="/" />

        <div className="puzzle-categories">
          {CHESS_PUZZLES.map((category) => (
            <div
              key={category.id}
              className="puzzle-category"
              onClick={() => navigate(`/puzzles/${category.id}`)}
            >
              <h2>{category.title}</h2>
              <p>{category.description}</p>
              <span className="puzzle-count">
                Tasks: {category.puzzles.length}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Показываем список задач в выбранной категории
  const category = CHESS_PUZZLES.find((c) => c.id === categoryId);
  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    <div className="tutorial-page">
      <h1>{category.title}</h1>
      <BackButton linkToPage="/puzzles" />

      <div className="puzzle-list">
        {category.puzzles.map((puzzle) => (
          <div
            key={puzzle.id}
            className="puzzle-item"
            onClick={() => navigate(`/puzzles/${categoryId}/${puzzle.id}`)}
          >
            <h3>{puzzle.title}</h3>
            <p>{puzzle.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PuzzleList;
