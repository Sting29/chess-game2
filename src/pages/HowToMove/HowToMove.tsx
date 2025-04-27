import { useLocation, useNavigate } from "react-router-dom";
import {
  TutorialPageContainer,
  TutorialTitle,
  TutorialDescription,
  NavigationLinksContainer,
  // NavigationButton,
} from "./styles";
import ChessTutorialButton from "src/components/ChessTutorialButton/ChessTutorialButton";

import BackButtonImage from "src/components/BackButtonImage/BackButtonImage";
import { HOW_TO_MOVE } from "src/data/how-to-move";

function HowToMove() {
  const navigate = useNavigate();
  const currentPath = useLocation().pathname;
  const previousPage = "/";

  return (
    <TutorialPageContainer>
      <TutorialTitle>How to Move</TutorialTitle>
      <TutorialDescription>Learn how chess pieces move:</TutorialDescription>

      <BackButtonImage linkToPage={previousPage} />

      <NavigationLinksContainer>
        {HOW_TO_MOVE.map((link) => (
          <ChessTutorialButton
            key={`${currentPath}/${link.id}`}
            title={link.pageTitle}
            image={link.image}
            onClick={() => navigate(link.id)}
          />
        ))}
      </NavigationLinksContainer>
    </TutorialPageContainer>
  );
}

export default HowToMove;
