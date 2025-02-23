import { useNavigate } from "react-router-dom";
import { ChessTutorialBoard } from "../components/ChessTutorialBoard";

export function HowToMove() {
  const navigate = useNavigate();

  return (
    <div className="tutorial-page">
      <h1>How to Move</h1>
      <p>Изучите как ходят шахматные фигуры:</p>

      <div className="navigation-links">
        {[
          { path: "/pawn-move", title: "Как ходит пешка" },
          { path: "/rook-move", title: "Как ходит ладья" },
          { path: "/knight-move", title: "Как ходит конь" },
          { path: "/bishop-move", title: "Как ходит слон" },
          { path: "/queen-move", title: "Как ходит ферзь" },
          { path: "/king-move", title: "Как ходит король" },
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
