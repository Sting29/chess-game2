import { useLocation, useNavigate } from "react-router-dom";
import BackButton from "src/components/BackButton/BackButton";

export function HowToPlay() {
  const navigate = useNavigate();
  const currentPath = useLocation().pathname;

  const previousPage = "/";

  const pages = [
    { path: `${currentPath}/pawn-battle`, title: "Битва пешек" },
    { path: `${currentPath}/knight-battle`, title: "Битва коней" },
  ];

  return (
    <div className="tutorial-page">
      <h1>Как играть в шахматы</h1>

      <BackButton linkToPage={previousPage} />

      <p>Изучите как играть фигурами:</p>

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
