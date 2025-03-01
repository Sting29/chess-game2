import { useLocation, useNavigate } from "react-router-dom";

export function HowToMove() {
  const navigate = useNavigate();
  const currentPath = useLocation().pathname;

  return (
    <div className="tutorial-page">
      <h1>How to Move</h1>

      <button className="back-button" onClick={() => navigate("/")}>
        Вернуться назад
      </button>

      <p>Изучите как ходят шахматные фигуры:</p>

      <div className="navigation-links">
        {[
          { path: `${currentPath}/pawn-move`, title: "Как ходит пешка" },
          { path: `${currentPath}/rook-move`, title: "Как ходит ладья" },
          { path: `${currentPath}/knight-move`, title: "Как ходит конь" },
          { path: `${currentPath}/bishop-move`, title: "Как ходит слон" },
          { path: `${currentPath}/queen-move`, title: "Как ходит ферзь" },
          { path: `${currentPath}/king-move`, title: "Как ходит король" },
        ].map((link) => (
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
