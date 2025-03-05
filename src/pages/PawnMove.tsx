import { useLocation } from "react-router-dom";
import { ChessTutorialBoard } from "../components/ChessTutorialBoard";
import { useState } from "react";
import { Square } from "../types/types";
import GameComplete from "src/components/GameComplete/GameComplete";
import BackButton from "src/components/BackButton/BackButton";
import { Description } from "../components/Description/Description";
import styled from "styled-components";

const PageContainer = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const ContentContainer = styled.div`
  display: flex;
  gap: 2rem;
  align-items: flex-start;
`;

const MainContent = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
`;

const SideContent = styled.div`
  width: 300px;
  flex-shrink: 0;
`;

const BoardContainer = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
`;

const ResetButton = styled.button`
  margin-top: 1rem;
  padding: 0.8rem 1.5rem;
  background-color: #4a4a4a;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #333;
  }
`;

const BoomAnimation = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 3rem;
  color: red;
  font-weight: bold;
  animation: boom 0.5s ease-out;

  @keyframes boom {
    0% {
      transform: translate(-50%, -50%) scale(0);
      opacity: 1;
    }
    100% {
      transform: translate(-50%, -50%) scale(2);
      opacity: 0;
    }
  }
`;

export function PawnMove() {
  const [showBoom, setShowBoom] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [currentGameStatus, setCurrentGameStatus] = useState<
    "playing" | "white_wins" | "draw"
  >("playing");

  const initialPosition = "8/1p6/p7/8/8/8/1P6/8 w - - 0 1";
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
          <Title>Как ходит пешка</Title>
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
            title="Правила ходов пешкой"
            hints={[
              "Пешка ходит только вперед на одну клетку",
              "С начальной позиции может ходить на две клетки вперед",
              "Бьет только по диагонали на одну клетку вперед",
              "При достижении последней горизонтали превращается в ферзя",
            ]}
          />
        </SideContent>
      </ContentContainer>
    </PageContainer>
  );
}
