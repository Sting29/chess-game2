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

import { useBreakpoint } from "src/hooks/useBreakpoint";

function HowToMove() {
  const navigate = useNavigate();
  const currentPath = useLocation().pathname;
  const previousPage = "/";
  const { breakpoint } = useBreakpoint();

  const getVisibleCount = () => {
    switch (breakpoint) {
      case "mobile":
        return 1;
      case "tablet":
        return 2;
      case "laptop":
        return 3;
      case "desktop":
      case "fullHD":
        return 4;
      default:
        return 4;
    }
  };

  return (
    <TutorialPageContainer>
      <TutorialTitle>How to Move</TutorialTitle>
      <TutorialDescription>Learn how chess pieces move:</TutorialDescription>
      <BackButtonWrap>
        <BackButtonImage linkToPage={previousPage} />
      </BackButtonWrap>

      <NavigationLinksContainer>
        <TutorialSlider visibleCount={getVisibleCount()}>
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
