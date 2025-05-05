import { useLocation, useParams } from "react-router-dom";
import { ChessBattleBoard } from "../../components/ChessBattleBoard";
import { useState } from "react";
import { Square } from "../../types/types";
import GameComplete from "src/components/GameComplete/GameComplete";
import { BackButtonWrap, PageContainer, ResetButton } from "./styles";
import BackButtonImage from "src/components/BackButtonImage/BackButtonImage";
import { PageTitle } from "src/components/PageTitle/PageTitle";
import { HOW_TO_PLAY } from "src/data/how-to-play";

function ChessBattle() {
  const { battleId } = useParams<{ battleId: string }>();
  const [showBoom, setShowBoom] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [currentGameStatus, setCurrentGameStatus] = useState<
    "playing" | "white_wins" | "black_wins" | "draw"
  >("playing");

  const battleData = HOW_TO_PLAY.find((battle) => battle.id === battleId);
  const location = useLocation();

  if (!battleData) {
    return <div>Battle not found</div>;
  }
  const initialPosition = battleData.initialPosition;
  const previousPage = location.pathname.split("/").slice(0, -1).join("/");

  const handleCapture = (square: Square) => {
    setShowBoom(true);
    setTimeout(() => setShowBoom(false), 500);
  };

  const handleComplete = (
    gameStatus: "playing" | "white_wins" | "black_wins" | "draw"
  ) => {
    if (
      gameStatus === "white_wins" ||
      gameStatus === "black_wins" ||
      gameStatus === "draw"
    ) {
      setGameComplete(true);
    }
    setCurrentGameStatus(gameStatus);
  };

  return (
    <PageContainer>
      <PageTitle title={battleData.title} />
      <BackButtonWrap>
        <BackButtonImage linkToPage={previousPage} />
      </BackButtonWrap>

      <ChessBattleBoard
        initialPosition={battleData.initialPosition}
        onCapture={handleCapture}
        onComplete={handleComplete}
      />

      {showBoom && <div className="boom-animation">BOOM!</div>}
      {gameComplete && <GameComplete gameStatus={currentGameStatus} />}

      <ResetButton onClick={() => window.location.reload()}>Reset</ResetButton>
    </PageContainer>
  );
}

export default ChessBattle;
