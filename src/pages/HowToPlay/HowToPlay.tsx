import { useLocation, useNavigate } from "react-router-dom";
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

function HowToPlay() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const currentPath = useLocation().pathname;
  const previousPage = "/";

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
        {HOW_TO_PLAY.map((link) => (
          <ChessTutorialButton
            widgetSize={link.widgetSize as WidgetSize}
            key={link.id}
            title={t(link.titleKey)}
            image={link.image}
            onClick={() => navigate(`${currentPath}/${link.id}`)}
          />
        ))}
      </NavigationLinksContainer>
    </TutorialPageContainer>
  );
}

export default HowToPlay;
