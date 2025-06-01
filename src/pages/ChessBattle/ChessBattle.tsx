import { useLocation, useParams } from "react-router-dom";
import { ChessBattleBoard } from "src/components/ChessBattleBoard/ChessBattleBoard";
import { useState } from "react";
import { Square } from "src/types/types";
import GameComplete from "src/components/GameComplete/GameComplete";
import { PageContainer } from "./styles";
import BackButtonImage from "src/components/BackButtonImage/BackButtonImage";
import { PageTitle } from "src/components/PageTitle/PageTitle";
import { HOW_TO_PLAY } from "src/data/how-to-play";
import { BackButtonWrap } from "src/components/BackButtonImage/styles";
import { useTranslation } from "react-i18next";
import QuestionButton from "src/components/QuestionButton/QuestionButton";
import { Description } from "src/components/Description/Description";
import {
  ContentContainer,
  MainContent,
  SideContent,
  QuestionButtonWrap,
  ResetButton,
} from "../ChessMoves/styles";

function ChessBattle() {
  const { t } = useTranslation();
  const { battleId } = useParams<{ battleId: string }>();
  const [showBoom, setShowBoom] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [showSideContent, setShowSideContent] = useState(true);

  const [currentGameStatus, setCurrentGameStatus] = useState<
    "playing" | "white_wins" | "black_wins" | "draw"
  >("playing");

  const gameData = HOW_TO_PLAY.find((battle) => battle.id === battleId);
  const location = useLocation();

  if (!gameData) {
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
      <ContentContainer>
        <MainContent>
          <PageTitle title={t(gameData.titleKey)} />
          <BackButtonWrap>
            <BackButtonImage linkToPage={previousPage} />
          </BackButtonWrap>

          <QuestionButtonWrap>
            <QuestionButton
              onClick={() => setShowSideContent(!showSideContent)}
            />
            {showSideContent && (
              <SideContent>
                <Description
                  title={t(gameData.descriptionTitleKey)}
                  hints={
                    t(gameData.descriptionKey, {
                      returnObjects: true,
                    }) as string[]
                  }
                />
              </SideContent>
            )}
          </QuestionButtonWrap>

          {gameData.board === "ChessBattleBoard" && (
            <ChessBattleBoard
              initialPosition={gameData.initialPosition}
              onCapture={handleCapture}
              onComplete={handleComplete}
              rulesOfWin={gameData.rulesOfWin as "promotion" | "noFiguresLeft"}
            />
          )}

          {showBoom && <div className="boom-animation">{t("boom")}</div>}
          {gameComplete && <GameComplete gameStatus={currentGameStatus} />}

          <ResetButton onClick={() => window.location.reload()}>
            {t("reset")}
          </ResetButton>
        </MainContent>
      </ContentContainer>
    </PageContainer>
  );
}

export default ChessBattle;
