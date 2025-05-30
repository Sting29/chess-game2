import { useLocation, useParams } from "react-router-dom";
import { ChessBattleBoard } from "../../components/ChessBattleBoard";
import { useState } from "react";
import { Square } from "../../types/types";
import GameComplete from "src/components/GameComplete/GameComplete";
import { PageContainer, ResetButton } from "./styles";
import BackButtonImage from "src/components/BackButtonImage/BackButtonImage";
import { PageTitle } from "src/components/PageTitle/PageTitle";
import { HOW_TO_PLAY } from "src/data/how-to-play";
import { BackButtonWrap } from "src/components/BackButtonImage/styles";
import { useTranslation } from "react-i18next";

function ChessBattle() {
  const { t } = useTranslation();
  const { battleId } = useParams<{ battleId: string }>();
  const [showBoom, setShowBoom] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [currentGameStatus, setCurrentGameStatus] = useState<
    "playing" | "white_wins" | "black_wins" | "draw"
  >("playing");

  const battleData = HOW_TO_PLAY.find((battle) => battle.id === battleId);
  const location = useLocation();

  if (!battleData) {
    return <div>{t("battle_not_found")}</div>;
  }
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
      <PageTitle title={t(battleData.titleKey)} />
      <BackButtonWrap>
        <BackButtonImage linkToPage={previousPage} />
      </BackButtonWrap>

      <ChessBattleBoard
        initialPosition={battleData.initialPosition}
        onCapture={handleCapture}
        onComplete={handleComplete}
      />

      {showBoom && <div className="boom-animation">{t("boom")}</div>}
      {gameComplete && <GameComplete gameStatus={currentGameStatus} />}

      <ResetButton onClick={() => window.location.reload()}>
        {t("reset")}
      </ResetButton>
    </PageContainer>
  );
}

export default ChessBattle;
