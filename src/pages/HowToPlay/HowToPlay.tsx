import { useLocation, useNavigate } from "react-router-dom";
import BackButtonImage from "src/components/BackButtonImage/BackButtonImage";
import {
  TutorialPageContainer,
  TutorialDescription,
  NavigationLinksContainer,
  BackButtonWrap,
} from "./styles";
import ChessTutorialButton, {
  WidgetSize,
} from "src/components/ChessTutorialButton/ChessTutorialButton";
import { PageTitle } from "src/components/PageTitle/PageTitle";

import { HOW_TO_PLAY } from "src/data/how-to-play";

function HowToPlay() {
  const navigate = useNavigate();
  const currentPath = useLocation().pathname;
  const previousPage = "/";

  return (
    <TutorialPageContainer>
      <PageTitle title="How to Play Chess" />
      <TutorialDescription>Learn how to play with pieces:</TutorialDescription>
      <BackButtonWrap>
        <BackButtonImage linkToPage={previousPage} />
      </BackButtonWrap>
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
