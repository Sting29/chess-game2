import { useLocation } from "react-router-dom";
import { ChessTutorialBoard } from "src/components/ChessTutorialBoard";
import { useState } from "react";
import { Square } from "src/types/types";
import GameComplete from "src/components/GameComplete/GameComplete";
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

function KnightMove() {
  const [showBoom, setShowBoom] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [currentGameStatus, setCurrentGameStatus] = useState<
    "playing" | "white_wins" | "draw"
  >("playing");

  const initialPosition = "8/1p6/8/2p5/4p3/p7/8/1N6 w - - 0 1";
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
          <Title>Как ходит конь</Title>
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
            title="Правила ходов конём"
            hints={[
              "Конь ходит буквой 'Г' - на две клетки вперёд и одну в сторону",
              "Может перепрыгивать через другие фигуры",
              "Ходит только на поля другого цвета",
              "Бьет фигуры противника, становясь на их место",
            ]}
          />
        </SideContent>
      </ContentContainer>
    </PageContainer>
  );
}

export default KnightMove;
