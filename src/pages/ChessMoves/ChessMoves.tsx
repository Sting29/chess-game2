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
function ChessMoves() {
  const { pieceId } = useParams<{ pieceId: string }>();
  const [showBoom, setShowBoom] = useState(false);
  // const [gameComplete, setGameComplete] = useState(false);
  // const [currentGameStatus, setCurrentGameStatus] = useState<
  //   "playing" | "white_wins" | "draw"
  // >("playing");
  const [showSideContent, setShowSideContent] = useState(true);

  const pieceData = HOW_TO_MOVE.find((piece) => piece.id === pieceId);

  if (!pieceData) {
    return <div>Piece not found</div>;
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
          <PageTitle title={pieceData.pageTitle} />
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
                  title={pieceData.descriptionTitle}
                  hints={pieceData.description}
                />
              </SideContent>
            )}
          </QuestionButtonWrap>
          <ChessTutorialBoard
            initialPosition={pieceData.initialPosition}
            onCapture={handleCapture}
            // onComplete={handleComplete}
          />
          {showBoom && <BoomAnimation>BOOM!</BoomAnimation>}
          {/* {gameComplete && <GameComplete gameStatus={currentGameStatus} />} */}
          <ResetButton onClick={() => window.location.reload()}>
            Reset
          </ResetButton>
        </MainContent>
      </ContentContainer>
    </PageContainer>
  );
}

export default ChessMoves;
