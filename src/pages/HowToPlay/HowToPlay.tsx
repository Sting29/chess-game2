import BackButtonImage from "src/components/BackButtonImage/BackButtonImage";
import {
  TutorialPageContainer,
  TutorialDescription,
  NavigationLinksContainer,
} from "./styles";
import ChessTutorialButton, {
  WidgetSize,
} from "src/components/ChessTutorialButton/ChessTutorialButton";
import { PageTitle } from "src/components/PageTitle/PageTitle";
import { BackButtonWrap } from "src/components/BackButtonImage/styles";
import { HOW_TO_PLAY } from "src/data/how-to-play";
import { useTranslation } from "react-i18next";
import TutorialSlider from "src/components/TutorialSlider/TutorialSlider";
import { useMemo } from "react";
import { useBreakpoint } from "src/hooks/useBreakpoint";

const visibleCountMap = {
  mobile: 1,
  tablet: 2,
  laptop: 3,
  desktop: 4,
  fullHD: 4,
};

function HowToPlay() {
  const { t } = useTranslation();
  const previousPage = "/";
  const { breakpoint } = useBreakpoint();

  const visibleCount = visibleCountMap[breakpoint] ?? 4;

  const buttons = useMemo(
    () =>
      HOW_TO_PLAY.map((link) => (
        <ChessTutorialButton
          widgetSize={link.widgetSize as WidgetSize}
          key={link.id}
          title={t(link.titleKey)}
          image={link.image}
          href={`/how-to-play/${link.id}`}
        />
      )),
    [t]
  );

  return (
    <TutorialPageContainer>
      <PageTitle title={t("how_to_play_chess")} />
      <TutorialDescription>
        {t("learn_how_to_play_with_pieces")}
      </TutorialDescription>
      <BackButtonWrap>
        <BackButtonImage linkToPage={previousPage} />
      </BackButtonWrap>
      <NavigationLinksContainer>
        <TutorialSlider visibleCount={visibleCount}>{buttons}</TutorialSlider>
      </NavigationLinksContainer>
    </TutorialPageContainer>
  );
}

export default HowToPlay;
