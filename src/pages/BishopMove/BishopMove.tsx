import { useState } from "react";
import { useLocation } from "react-router-dom";
import { ChessTutorialBoard } from "../../components/ChessTutorialBoard";
import GameComplete from "../../components/GameComplete/GameComplete";
import { Square } from "../../types/types";
import BackButton from "src/components/BackButton/BackButton";
import { Description } from "src/components/Description/Description";
import {
  PageContainer,
  ContentContainer,
  MainContent,
  Title,
  SideContent,
  BoardContainer,
  ResetButton,
  BoomAnimation,
} from "./styles";

function BishopMove() {
  const [showBoom, setShowBoom] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [currentGameStatus, setCurrentGameStatus] = useState<
    "playing" | "white_wins" | "draw"
  >("playing");

  const initialPosition = "8/3p4/8/1p3p2/8/8/8/5B2 w - - 0 1";
  const previousPage = useLocation().pathname.split("/").slice(0, -1).join("/");

  const handleCapture = (square: Square) => {
    setShowBoom(true);
    setTimeout(() => setShowBoom(false), 500);
  };

  const handleComplete = (gameStatus: "playing" | "white_wins" | "draw") => {
    if (gameStatus === "white_wins" || gameStatus === "draw") {
      setGameComplete(true);
    }
    setCurrentGameStatus(gameStatus);
  };

  return (
    <PageContainer>
      <ContentContainer>
        <MainContent>
          <Title>Как ходит слон</Title>
          <BackButton linkToPage={previousPage} />

          <BoardContainer>
            <ChessTutorialBoard
              initialPosition={initialPosition}
              onCapture={handleCapture}
              onComplete={handleComplete}
            />
            {showBoom && <BoomAnimation>BOOM!</BoomAnimation>}
          </BoardContainer>

          {gameComplete && <GameComplete gameStatus={currentGameStatus} />}

          <ResetButton onClick={() => window.location.reload()}>
            Сбросить
          </ResetButton>
        </MainContent>

        <SideContent>
          <Description
            title="Правила ходов слоном"
            hints={[
              "Слон ходит по диагонали на любое количество клеток",
              "Не может перепрыгивать через другие фигуры",
              "Всегда остается на полях одного цвета",
              "Бьет фигуры противника, становясь на их место",
            ]}
          />
        </SideContent>
      </ContentContainer>
    </PageContainer>
  );
}

export default BishopMove;
