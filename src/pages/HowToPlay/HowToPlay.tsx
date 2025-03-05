import { useLocation, useNavigate } from "react-router-dom";
import BackButton from "src/components/BackButton/BackButton";
import {
  TutorialPageContainer,
  TutorialTitle,
  TutorialDescription,
  NavigationLinksContainer,
} from "./styles";
import ChessTutorialButton from "src/components/ChessTutorialButton/ChessTutorialButton";

import ChessPawn from "src/assets/images/chess_pawn.jpg";
import ChessKnight from "src/assets/images/chess_knight.jpg";

function HowToPlay() {
  const navigate = useNavigate();
  const currentPath = useLocation().pathname;
  const previousPage = "/";

  const pages = [
    {
      path: `${currentPath}/pawn-battle`,
      title: "Битва пешек",
      image: ChessPawn,
    },
    {
      path: `${currentPath}/knight-battle`,
      title: "Битва коней",
      image: ChessKnight,
    },
  ];

  return (
    <TutorialPageContainer>
      <TutorialTitle>Как играть в шахматы</TutorialTitle>
      <TutorialDescription>Изучите как играть фигурами:</TutorialDescription>

      <BackButton linkToPage={previousPage} />

      <NavigationLinksContainer>
        {pages.map((link) => (
          <ChessTutorialButton
            key={link.path}
            title={link.title}
            image={link.image}
            onClick={() => navigate(link.path)}
          />
        ))}
      </NavigationLinksContainer>
    </TutorialPageContainer>
  );
}

export default HowToPlay;
