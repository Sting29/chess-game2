import { useLocation, useNavigate } from "react-router-dom";
import {
  TutorialPageContainer,
  TutorialTitle,
  TutorialDescription,
  NavigationLinksContainer,
  BackButtonWrap,
} from "./styles";
import ChessTutorialButton from "src/components/ChessTutorialButton/ChessTutorialButton";
import TutorialSlider from "src/components/TutorialSlider/TutorialSlider";

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
      <BackButtonWrap>
        <BackButtonImage linkToPage={previousPage} />
      </BackButtonWrap>

      <NavigationLinksContainer>
        <TutorialSlider visibleCount={4}>
          {HOW_TO_MOVE.map((link) => (
            <ChessTutorialButton
              key={`${currentPath}/${link.id}`}
              title={link.pageTitle}
              image={link.image}
              onClick={() => navigate(link.id)}
            />
          ))}
        </TutorialSlider>
      </NavigationLinksContainer>
    </TutorialPageContainer>
  );
}

export default HowToMove;
