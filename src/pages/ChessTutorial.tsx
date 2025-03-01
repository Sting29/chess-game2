import { useNavigate } from "react-router-dom";
import "./ChessTutorial.css";

export function ChessTutorial() {
  const navigate = useNavigate();

  return (
    <div className="chess-tutorial">
      <h1>Шахматный Учебник</h1>

      <div className="tutorial-links">
        <button
          className="tutorial-button"
          onClick={() => navigate("/how-to-move")}
        >
          Как ходят фигуры
        </button>

        <button
          className="tutorial-button"
          onClick={() => navigate("/how-to-play")}
        >
          Как играть в шахматы
        </button>
      </div>
    </div>
  );
}
