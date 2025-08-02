import { useState, useCallback } from "react";
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
  const [resetKey, setResetKey] = useState(0);

  const handleGameEnd = (result: string) => {
    setGameResult(result);
    setShowBoom(true);
    setTimeout(() => setShowBoom(false), 500);
  };

  const handleReset = useCallback(() => {
    setResetKey((prev) => prev + 1);
    setGameResult(null);
    setShowBoom(false);
  }, []);

  const previousPage = "/play";

  return (
    <PageContainer>
      <ContentContainer>
        <MainContent>
          <PageTitle title={t("play_with_friend")} />
          <BackButtonWrap>
            <BackButtonImage linkToPage={previousPage} />
          </BackButtonWrap>
          <PersonsChessBoard key={resetKey} onGameEnd={handleGameEnd} />
          {gameResult && (
            <>
              <GameCompleteMessage>{gameResult}</GameCompleteMessage>
              <ResetButton onClick={handleReset}>{t("play_again")}</ResetButton>
            </>
          )}
          {showBoom && <BoomAnimation>{t("boom")}</BoomAnimation>}
          {/* {gameComplete && <GameComplete gameStatus={currentGameStatus} />} */}
          <ResetButton onClick={handleReset}>{t("reset")}</ResetButton>
        </MainContent>
      </ContentContainer>
    </PageContainer>
  );
}

export default PlayWithPerson;
