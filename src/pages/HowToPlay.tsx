import { useNavigate } from "react-router-dom";
import "./TutorialPage.css";

export function HowToPlay() {
  const navigate = useNavigate();

  return (
    <div className="tutorial-page">
      <h1>Как играть в шахматы</h1>

      <button className="back-button" onClick={() => navigate("/")}>
        Вернуться назад
      </button>

      <div className="tutorial-content">
        <p>Привет</p>
      </div>
    </div>
  );
}
