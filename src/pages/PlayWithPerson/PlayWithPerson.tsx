import { useState } from "react";
import { PersonsChessBoard } from "../../components/PersonsChessBoard/PersonsChessBoard";
import {
  PageContainer,
  ContentContainer,
  MainContent,
  GameCompleteMessage,
  ResetButton,
} from "./styles";
import { useTranslation } from "react-i18next";

function PlayWithPerson() {
  const { t } = useTranslation();
  const [gameResult, setGameResult] = useState<string | null>(null);

  const handleGameEnd = (result: string) => {
    setGameResult(result);
  };

  const handleReset = () => {
    window.location.reload();
  };

  return (
    <PageContainer>
      <ContentContainer>
        <MainContent>
          <h1>{t("play_with_friend")}</h1>
          <PersonsChessBoard onGameEnd={handleGameEnd} />
          {gameResult && (
            <>
              <GameCompleteMessage>{gameResult}</GameCompleteMessage>
              <ResetButton onClick={handleReset}>{t("play_again")}</ResetButton>
            </>
          )}
        </MainContent>
      </ContentContainer>
    </PageContainer>
  );
}

export default PlayWithPerson;
