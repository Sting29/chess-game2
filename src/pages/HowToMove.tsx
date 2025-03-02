import { useLocation, useNavigate } from "react-router-dom";
import BackButton from "src/components/BackButton/BackButton";

export function HowToMove() {
  const navigate = useNavigate();
  const currentPath = useLocation().pathname;
  const previousPage = "/";

  const pages = [
    { path: `${currentPath}/pawn-move`, title: "Как ходит пешка" },
    { path: `${currentPath}/rook-move`, title: "Как ходит ладья" },
    { path: `${currentPath}/knight-move`, title: "Как ходит конь" },
    { path: `${currentPath}/bishop-move`, title: "Как ходит слон" },
    { path: `${currentPath}/queen-move`, title: "Как ходит ферзь" },
  ];

  return (
    <div className="tutorial-page">
      <h1>How to Move</h1>

      <BackButton linkToPage={previousPage} />

      <p>Изучите как ходят шахматные фигуры:</p>

      <div className="navigation-links">
        {pages.map((link) => (
          <button
            key={link.path}
            onClick={() => navigate(link.path)}
            className="navigation-button"
          >
            {link.title}
          </button>
        ))}
      </div>
    </div>
  );
}
