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

function QueenMove() {
  const [showBoom, setShowBoom] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [currentGameStatus, setCurrentGameStatus] = useState<
    "playing" | "white_wins" | "draw"
  >("playing");

  const initialPosition = "8/8/1p6/3p4/8/5p2/8/3Q4 w - - 0 1";
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
          <Title>Как ходит ферзь</Title>
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
            title="Правила ходов ферзём"
            hints={[
              "Ферзь - самая сильная фигура в шахматах (ценность: 9 пешек)",
              "Ходит на любое количество клеток по горизонтали, вертикали и диагонали",
              "Сочетает в себе силу ладьи и слона",
              "Не может перепрыгивать через другие фигуры",
              "Бьет фигуры противника, становясь на их место",
              "В начале игры стоит на поле своего цвета (белый ферзь на белом, черный на черном)",
              "Является ключевой фигурой в атаке",
              "Старайтесь не выводить ферзя слишком рано в дебюте",
            ]}
          />
        </SideContent>
      </ContentContainer>
    </PageContainer>
  );
}

export default QueenMove;
