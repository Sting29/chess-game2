import { useState } from "react";
import { PersonsChessBoard } from "../../components/PersonsChessBoard/PersonsChessBoard";
import {
  PageContainer,
  ContentContainer,
  MainContent,
  GameCompleteMessage,
  ResetButton,
  BoomAnimation,
} from "./styles";
import { useTranslation } from "react-i18next";
import { PageTitle } from "src/components/PageTitle/PageTitle";
import { BackButtonWrap } from "src/components/BackButtonImage/styles";
import BackButtonImage from "src/components/BackButtonImage/BackButtonImage";

function PlayWithPerson() {
  const { t } = useTranslation();
  const [gameResult, setGameResult] = useState<string | null>(null);
  const [showBoom, setShowBoom] = useState(false);

  const handleGameEnd = (result: string) => {
    setGameResult(result);
    setShowBoom(true);
    setTimeout(() => setShowBoom(false), 500);
  };

  const handleReset = () => {
    window.location.reload();
  };

  const previousPage = "/play";

  return (
    <PageContainer>
      <ContentContainer>
        <MainContent>
          <PageTitle title={t("play_with_friend")} />
          <BackButtonWrap>
            <BackButtonImage linkToPage={previousPage} />
          </BackButtonWrap>
          <PersonsChessBoard onGameEnd={handleGameEnd} />
          {gameResult && (
            <>
              <GameCompleteMessage>{gameResult}</GameCompleteMessage>
              <ResetButton onClick={handleReset}>{t("play_again")}</ResetButton>
            </>
          )}
          {showBoom && <BoomAnimation>{t("boom")}</BoomAnimation>}
          {/* {gameComplete && <GameComplete gameStatus={currentGameStatus} />} */}
          <ResetButton onClick={() => window.location.reload()}>
            {t("reset")}
          </ResetButton>
        </MainContent>
      </ContentContainer>
    </PageContainer>
  );
}

export default PlayWithPerson;
