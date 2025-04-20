import { useState } from "react";
import { PersonsChessBoard } from "../../components/PersonsChessBoard/PersonsChessBoard";
import {
  PageContainer,
  ContentContainer,
  MainContent,
  GameCompleteMessage,
  ResetButton,
} from "./styles";

function PlayWithPerson() {
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
          <h1>Play with Friend</h1>
          <PersonsChessBoard onGameEnd={handleGameEnd} />
          {gameResult && (
            <>
              <GameCompleteMessage>{gameResult}</GameCompleteMessage>
              <ResetButton onClick={handleReset}>Play Again</ResetButton>
            </>
          )}
        </MainContent>
      </ContentContainer>
    </PageContainer>
  );
}

export default PlayWithPerson;
