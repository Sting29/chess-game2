import { useLocation, useNavigate } from "react-router-dom";
import BackButtonImage from "src/components/BackButtonImage/BackButtonImage";
import {
  TutorialPageContainer,
  TutorialTitle,
  TutorialDescription,
  NavigationLinksContainer,
} from "./styles";
import ChessTutorialButton, {
  WidgetSize,
} from "src/components/ChessTutorialButton/ChessTutorialButton";

import { HOW_TO_PLAY } from "src/data/how-to-play";

function HowToPlay() {
  const navigate = useNavigate();
  const currentPath = useLocation().pathname;
  const previousPage = "/";

  return (
    <TutorialPageContainer>
      <TutorialTitle>How to Play Chess</TutorialTitle>
      <TutorialDescription>Learn how to play with pieces:</TutorialDescription>

      <BackButtonImage linkToPage={previousPage} />

      <NavigationLinksContainer>
        {HOW_TO_PLAY.map((link) => (
          <ChessTutorialButton
            widgetSize={link.widgetSize as WidgetSize}
            key={link.path}
            title={link.title}
            image={link.image}
            onClick={() => navigate(`${currentPath}${link.path}`)}
          />
        ))}
      </NavigationLinksContainer>
    </TutorialPageContainer>
  );
}

export default HowToPlay;
