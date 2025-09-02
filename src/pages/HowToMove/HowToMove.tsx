import {
  TutorialPageContainer,
  TutorialDescription,
  NavigationLinksContainer,
} from "./styles";
import ChessTutorialButton from "src/components/ChessTutorialButton/ChessTutorialButton";
import TutorialSlider from "src/components/TutorialSlider/TutorialSlider";
import { PageTitle } from "src/components/PageTitle/PageTitle";
import BackButtonImage from "src/components/BackButtonImage/BackButtonImage";
import { HOW_TO_MOVE } from "src/data/how-to-move";
import { BackButtonWrap } from "src/components/BackButtonImage/styles";
import { useBreakpoint } from "src/hooks/useBreakpoint";
import { useHowToMoveProgress } from "src/hooks/useHowToMoveProgress";
import { useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { fetchAllProgress } from "src/store/progressSlice";
import { AppDispatch } from "src/store";

const visibleCountMap = {
  mobile: 1,
  tablet: 2,
  laptop: 3,
  desktop: 4,
  fullHD: 4,
};

function HowToMove() {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const previousPage = "/";
  const { breakpoint } = useBreakpoint();

  // Get progress data
  const { isLessonCompleted } = useHowToMoveProgress();

  const visibleCount = visibleCountMap[breakpoint] ?? 4;

  // Load progress data on component mount
  useEffect(() => {
    dispatch(fetchAllProgress());
  }, [dispatch]);

  const buttons = useMemo(
    () =>
      HOW_TO_MOVE.map((link) => (
        <ChessTutorialButton
          key={link.id}
          title={t(link.pageTitleKey)}
          image={link.image}
          to={`/how-to-move/${link.link}`}
          isCompleted={isLessonCompleted(link.id)}
        />
      )),
    [t, isLessonCompleted]
  );

  return (
    <TutorialPageContainer>
      <PageTitle title={t("how_to_move")} />
      <TutorialDescription>{t("learn_how_pieces_move")}</TutorialDescription>
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
