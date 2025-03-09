import { useLocation } from "react-router-dom";
import { ChessTutorialBoard } from "../../components/ChessTutorialBoard";
import { useState } from "react";
import { Square } from "../../types/types";
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

function KingMove() {
  const [showBoom, setShowBoom] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [currentGameStatus, setCurrentGameStatus] = useState<
    "playing" | "white_wins" | "draw"
  >("playing");

  const initialPosition = "8/8/1p6/3p4/8/5p2/8/3K4 w - - 0 1";
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
          <Title>Как ходит король</Title>
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
            title="Правила ходов королём"
            hints={[
              "Король - самая важная фигура в шахматах (бесконечная ценность)",
              "Ходит на одну клетку в любом направлении (по горизонтали, вертикали и диагонали)",
              "Не может ходить под шах или оставаться под шахом",
              "Бьет фигуры противника, становясь на их место",
              "В начале игры белый король стоит на черном поле, черный - на белом",
              "Может делать специальный ход - рокировку (с ладьей)",
              "В эндшпиле становится активной фигурой",
              "Защита короля - главный приоритет в начале и середине игры",
            ]}
          />
        </SideContent>
      </ContentContainer>
    </PageContainer>
  );
}

export default KingMove;
