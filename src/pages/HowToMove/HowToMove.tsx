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
import { useMemo } from "react";

const visibleCountMap = {
  mobile: 1,
  tablet: 2,
  laptop: 3,
  desktop: 4,
  fullHD: 4,
};

function HowToMove() {
  const navigate = useNavigate();
  const currentPath = useLocation().pathname;
  const previousPage = "/";
  const { breakpoint } = useBreakpoint();

  const visibleCount = visibleCountMap[breakpoint] ?? 4;

  const buttons = useMemo(
    () =>
      HOW_TO_MOVE.map((link) => (
        <ChessTutorialButton
          key={`${currentPath}/${link.id}`}
          title={link.pageTitle}
          image={link.image}
          onClick={() => navigate(link.id)}
        />
      )),
    [currentPath, navigate]
  );

  return (
    <TutorialPageContainer>
      <TutorialTitle>How to Move</TutorialTitle>
      <TutorialDescription>Learn how chess pieces move:</TutorialDescription>
      <BackButtonWrap>
        <BackButtonImage linkToPage={previousPage} />
      </BackButtonWrap>

      <NavigationLinksContainer>
        <TutorialSlider visibleCount={visibleCount}>{buttons}</TutorialSlider>
      </NavigationLinksContainer>
    </TutorialPageContainer>
  );
}

export default HowToMove;
