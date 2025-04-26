import { useLocation } from "react-router-dom";
import { ChessTutorialBoard } from "../../components/ChessTutorialBoard";
import { useState } from "react";
import { Square } from "../../types/types";
import GameComplete from "src/components/GameComplete/GameComplete";
import BackButton from "src/components/BackButton/BackButton";
import { Description } from "../../components/Description/Description";
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

function PawnMove() {
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
          <Title>How to Move: Pawn</Title>
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
            Reset
          </ResetButton>
        </MainContent>

        <SideContent>
          <Description
            title="Pawn Movement Rules"
            hints={[
              "Pawn moves forward one square at a time",
              "From starting position, can move two squares forward",
              "Captures diagonally one square forward",
              "When reaching the last rank, promotes to any piece (except king)",
            ]}
          />
        </SideContent>
      </ContentContainer>
    </PageContainer>
  );
}

export default PawnMove;
