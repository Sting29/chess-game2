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
import { useTranslation } from "react-i18next";
import TutorialSlider from "src/components/TutorialSlider/TutorialSlider";
import { useMemo } from "react";
import { useBreakpoint } from "src/hooks/useBreakpoint";
import ChessKnight from "src/assets/images/slides/slide_knight.png";
import ChessPawn from "src/assets/images/slides/slide_pawn.png";

const visibleCountMap = {
  mobile: 1,
  tablet: 2,
  laptop: 2,
  desktop: 3,
  fullHD: 3,
};

const PLAY = [
  {
    id: `computer`,
    titleKey: "computer",
    // titleKey: "play_with_computer",
    image: ChessPawn,
    widgetSize: "large",
  },
  {
    id: `person`,
    titleKey: "person",
    // titleKey: "play_with_person",
    image: ChessKnight,
    widgetSize: "large",
  },
];

function Play() {
  const { t } = useTranslation();
  const previousPage = "/";
  const { breakpoint } = useBreakpoint();

  const visibleCount = visibleCountMap[breakpoint] ?? 3;

  const buttons = useMemo(
    () =>
      PLAY.map((link) => (
        <ChessTutorialButton
          widgetSize={link.widgetSize as WidgetSize}
          key={link.id}
          title={t(link.titleKey)}
          image={link.image}
          to={`/play/${link.id}`}
        />
      )),
    [t]
  );

  return (
    <TutorialPageContainer>
      <PageTitle title={t("play_chess")} />
      <TutorialDescription>{t("choose_with_whom_to_play")}</TutorialDescription>
      <BackButtonWrap>
        <BackButtonImage linkToPage={previousPage} />
      </BackButtonWrap>
      <NavigationLinksContainer>
        <TutorialSlider visibleCount={visibleCount}>{buttons}</TutorialSlider>
      </NavigationLinksContainer>
    </TutorialPageContainer>
  );
}

export default Play;
