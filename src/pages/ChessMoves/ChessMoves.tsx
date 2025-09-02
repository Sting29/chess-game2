import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { ChessTutorialBoard } from "../../components/ChessTutorialBoard/ChessTutorialBoard";
import { useState, useCallback } from "react";
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
import { useProgressTracking } from "src/hooks/useProgressTracking";
import { RootState } from "src/store";

function ChessMoves() {
  const { t } = useTranslation();
  const { pieceId } = useParams<{ pieceId: string }>();
  const [showBoom, setShowBoom] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [showSideContent, setShowSideContent] = useState(true);
  const [, setGameComplete] = useState(false);
  const [, setCurrentGameStatus] = useState<"playing" | "white_wins" | "draw">(
    "playing"
  );

  // Get current user from Redux store
  const currentUser = useSelector((state: RootState) => state.settings.user);
  const isAuthenticated = useSelector(
    (state: RootState) => state.settings.isAuthenticated
  );

  // Initialize progress tracking for how-to-move category
  const { trackPuzzleCompletion } = useProgressTracking({
    categoryId: "how_to_move",
    userId: currentUser?.id || "anonymous-user",
    type: "tutorial",
  });

  const handleCapture = () => {
    setShowBoom(true);
    setTimeout(() => setShowBoom(false), 500);
  };

  const handleReset = useCallback(() => {
    setResetKey((prev) => prev + 1);
    setShowBoom(false);
    setGameComplete(false);
    setCurrentGameStatus("playing");
  }, []);

  const gameData = HOW_TO_MOVE.find((piece) => piece.link === pieceId);

  if (!gameData) {
    return <div>{t("piece_not_found")}</div>;
  }

  const previousPage = "/how-to-move";

  const handleComplete = async (gameStatus: "white_wins" | "draw") => {
    console.log(`ChessMoves lesson completed with status: ${gameStatus}`);
    setCurrentGameStatus(gameStatus);
    setGameComplete(true);

    // Track completion of the lesson
    if (gameData && isAuthenticated && currentUser?.id) {
      console.log(`Tracking completion of how-to-move lesson: ${gameData.id}`);
      await trackPuzzleCompletion(gameData.id.toString());
    }
  };

  return (
    <PageContainer>
      <ContentContainer>
        <MainContent>
          <PageTitle title={t(gameData.pageTitleKey)} />
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
          <ChessTutorialBoard
            key={resetKey}
            initialPosition={gameData.initialPosition}
            onCapture={handleCapture}
            onComplete={handleComplete}
          />
          {showBoom && <BoomAnimation>{t("boom")}</BoomAnimation>}
          {/* {gameComplete && <GameComplete gameStatus={currentGameStatus} />} */}
          <ResetButton onClick={handleReset}>{t("reset")}</ResetButton>
        </MainContent>
      </ContentContainer>
    </PageContainer>
  );
}

export default ChessMoves;
