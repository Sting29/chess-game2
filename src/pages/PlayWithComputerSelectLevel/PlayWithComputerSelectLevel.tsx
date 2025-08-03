import {
  TutorialPageContainer,
  TutorialDescription,
  NavigationLinksContainer,
} from "./styles";
import ChessTutorialButton from "src/components/ChessTutorialButton/ChessTutorialButton";
import TutorialSlider from "src/components/TutorialSlider/TutorialSlider";
import { PageTitle } from "src/components/PageTitle/PageTitle";
import BackButtonImage from "src/components/BackButtonImage/BackButtonImage";
import { BackButtonWrap } from "src/components/BackButtonImage/styles";
import { useBreakpoint } from "src/hooks/useBreakpoint";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import ChessPawn from "src/assets/images/slides/slide_pawn.png";
import ChessKnight from "src/assets/images/slides/slide_knight.png";
import ChessQueen from "src/assets/images/slides/slide_queen.png";
import ChessKing from "src/assets/images/slides/slide_king.png";

const visibleCountMap = {
  mobile: 1,
  tablet: 2,
  laptop: 2,
  desktop: 3,
  fullHD: 3,
};

const PLAY_WITH_COMPUTER = [
  {
    id: `easy`,
    titleKey: "easy",
    image: ChessPawn,
    widgetSize: "large",
  },
  {
    id: `medium`,
    titleKey: "medium",
    image: ChessKnight,
    widgetSize: "large",
  },
  {
    id: `hard`,
    titleKey: "hard",
    image: ChessQueen,
    widgetSize: "large",
  },
  {
    id: `master`,
    titleKey: "master",
    image: ChessKing,
    widgetSize: "large",
  },
];

function PlayWithComputerSelectLevel() {
  const { t } = useTranslation();
  const previousPage = "/play";
  const { breakpoint } = useBreakpoint();

  const visibleCount = visibleCountMap[breakpoint] ?? 3;

  const buttons = useMemo(
    () =>
      PLAY_WITH_COMPUTER.map((link) => (
        <ChessTutorialButton
          key={link.id}
          title={t(link.titleKey)}
          image={link.image}
          to={`/play/computer/${link.id}`}
        />
      )),
    [t]
  );

  return (
    <TutorialPageContainer>
      <PageTitle title={t("play_with_computer")} />
      <TutorialDescription>{t("choose_rival")}</TutorialDescription>
      <BackButtonWrap>
        <BackButtonImage linkToPage={previousPage} />
      </BackButtonWrap>

      <NavigationLinksContainer>
        <TutorialSlider visibleCount={visibleCount}>{buttons}</TutorialSlider>
      </NavigationLinksContainer>
    </TutorialPageContainer>
  );
}

export default PlayWithComputerSelectLevel;
