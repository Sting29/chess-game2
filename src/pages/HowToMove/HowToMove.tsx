import { useLocation, useNavigate } from "react-router-dom";
import BackButton from "src/components/BackButton/BackButton";
import {
  TutorialPageContainer,
  TutorialTitle,
  TutorialDescription,
  NavigationLinksContainer,
  // NavigationButton,
} from "./styles";
import ChessTutorialButton from "src/components/ChessTutorialButton/ChessTutorialButton";

import ChessPawn from "src/assets/images/chess_pawn.jpg";
import ChessRook from "src/assets/images/chess_rook.jpg";
import ChessKnight from "src/assets/images/chess_knight.jpg";
import ChessBishop from "src/assets/images/chess_bishop.jpg";
import ChessQueen from "src/assets/images/chess_queen.jpg";
import ChessKing from "src/assets/images/chess_king.jpg";

function HowToMove() {
  const navigate = useNavigate();
  const currentPath = useLocation().pathname;
  const previousPage = "/";

  const pages = [
    {
      path: `${currentPath}/pawn-move`,
      title: "How to Move: Pawn",
      image: ChessPawn,
    },
    {
      path: `${currentPath}/rook-move`,
      title: "How to Move: Rook",
      image: ChessRook,
    },
    {
      path: `${currentPath}/knight-move`,
      title: "How to Move: Knight",
      image: ChessKnight,
    },
    {
      path: `${currentPath}/bishop-move`,
      title: "How to Move: Bishop",
      image: ChessBishop,
    },
    {
      path: `${currentPath}/queen-move`,
      title: "How to Move: Queen",
      image: ChessQueen,
    },
    {
      path: `${currentPath}/king-move`,
      title: "How to Move: King",
      image: ChessKing,
    },
  ];

  return (
    <TutorialPageContainer>
      <TutorialTitle>How to Move</TutorialTitle>
      <TutorialDescription>Learn how chess pieces move:</TutorialDescription>

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

export default HowToMove;
