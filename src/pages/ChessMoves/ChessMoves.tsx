import { useParams } from "react-router-dom";
import { ChessTutorialBoard } from "../../components/ChessTutorialBoard";
import { useState } from "react";
import { Square } from "../../types/types";
import GameComplete from "src/components/GameComplete/GameComplete";
import BackButton from "src/components/BackButton/BackButton";
import { Description } from "../../components/Description/Description";
import { HOW_TO_MOVE } from "../../data/how-to-move";
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

function ChessMoves() {
  const { pieceId } = useParams<{ pieceId: string }>();
  const [showBoom, setShowBoom] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [currentGameStatus, setCurrentGameStatus] = useState<
    "playing" | "white_wins" | "draw"
  >("playing");

  const pieceData = HOW_TO_MOVE.find((piece) => piece.id === pieceId);

  if (!pieceData) {
    return <div>Piece not found</div>;
  }

  const previousPage = "/how-to-move";

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
          <Title>{pieceData.pageTitle}</Title>
          <BackButton linkToPage={previousPage} />

          <BoardContainer>
            <ChessTutorialBoard
              initialPosition={pieceData.initialPosition}
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
            title={pieceData.descriptionTitle}
            hints={pieceData.description}
          />
        </SideContent>
      </ContentContainer>
    </PageContainer>
  );
}

export default ChessMoves;
