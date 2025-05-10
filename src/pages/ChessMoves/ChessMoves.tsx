import { useParams } from "react-router-dom";
import { ChessTutorialBoard } from "../../components/ChessTutorialBoard/ChessTutorialBoard";
import { useState } from "react";
import { Square } from "../../types/types";
// import GameComplete from "src/components/GameComplete/GameComplete";
import { Description } from "../../components/Description/Description";
import { HOW_TO_MOVE } from "../../data/how-to-move";
import {
  PageContainer,
  ContentContainer,
  MainContent,
  SideContent,
  ResetButton,
  BoomAnimation,
  QuestionButtonWrap,
} from "./styles";
import BackButtonImage from "src/components/BackButtonImage/BackButtonImage";
import QuestionButton from "src/components/QuestionButton/QuestionButton";
import { PageTitle } from "src/components/PageTitle/PageTitle";
import { BackButtonWrap } from "src/components/BackButtonImage/styles";
import { useTranslation } from "react-i18next";

function ChessMoves() {
  const { t } = useTranslation();
  const { pieceId } = useParams<{ pieceId: string }>();
  const [showBoom, setShowBoom] = useState(false);
  // const [gameComplete, setGameComplete] = useState(false);
  // const [currentGameStatus, setCurrentGameStatus] = useState<
  //   "playing" | "white_wins" | "draw"
  // >("playing");
  const [showSideContent, setShowSideContent] = useState(true);

  const pieceData = HOW_TO_MOVE.find((piece) => piece.id === pieceId);

  if (!pieceData) {
    return <div>{t("piece_not_found")}</div>;
  }

  const previousPage = "/how-to-move";

  const handleCapture = (square: Square) => {
    setShowBoom(true);
    setTimeout(() => setShowBoom(false), 500);
  };

  // const handleComplete = (gameStatus: "playing" | "white_wins" | "draw") => {
  //   if (gameStatus === "white_wins" || gameStatus === "draw") {
  //     setGameComplete(true);
  //   }
  //   setCurrentGameStatus(gameStatus);
  // };

  return (
    <PageContainer>
      <ContentContainer>
        <MainContent>
          <PageTitle title={t(pieceData.pageTitleKey)} />
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
                  title={t(pieceData.descriptionTitleKey)}
                  hints={
                    t(pieceData.descriptionKey, {
                      returnObjects: true,
                    }) as string[]
                  }
                />
              </SideContent>
            )}
          </QuestionButtonWrap>
          <ChessTutorialBoard
            initialPosition={pieceData.initialPosition}
            onCapture={handleCapture}
            // onComplete={handleComplete}
          />
          {showBoom && <BoomAnimation>{t("boom")}</BoomAnimation>}
          {/* {gameComplete && <GameComplete gameStatus={currentGameStatus} />} */}
          <ResetButton onClick={() => window.location.reload()}>
            {t("reset")}
          </ResetButton>
        </MainContent>
      </ContentContainer>
    </PageContainer>
  );
}

export default ChessMoves;
