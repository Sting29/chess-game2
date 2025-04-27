import { useLocation, useNavigate } from "react-router-dom";
import BackButtonImage from "src/components/BackButtonImage/BackButtonImage";
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
      title: "Pawn Battle",
      image: ChessPawn,
    },
    {
      path: `${currentPath}/knight-battle`,
      title: "Knight Battle",
      image: ChessKnight,
    },
  ];

  return (
    <TutorialPageContainer>
      <TutorialTitle>How to Play Chess</TutorialTitle>
      <TutorialDescription>Learn how to play with pieces:</TutorialDescription>

      <BackButtonImage linkToPage={previousPage} />

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
