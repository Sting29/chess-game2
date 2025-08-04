import { useCallback, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ComputerChessBoard } from "src/components/ComputerChessBoard/ComputerChessBoard";
import { useTranslation } from "react-i18next";
import {
  PageContainer,
  ContentContainer,
  MainContent,
  GameCompleteMessage,
  ResetButton,
  BoomAnimation,
  GameControls,
  SettingsButton,
  QuestionButtonWrap,
  SideContent,
  ChessBoardWrapper,
} from "./styles";
import { PageTitle } from "src/components/PageTitle/PageTitle";
import { BackButtonWrap } from "src/components/BackButtonImage/styles";
import BackButtonImage from "src/components/BackButtonImage/BackButtonImage";
import {
  getDifficultySettings,
  DifficultyLevel,
} from "src/config/gameSettings";
import GameSettingsModal from "src/components/GameSettingsModal";
import QuestionButton from "src/components/QuestionButton/QuestionButton";
import { Description } from "src/components/Description/Description";
import { ThreatInfo } from "src/types/types";
import { generateHints } from "src/utils/hintUtils";
import UserAvatar from "src/components/UserAvatar/UserAvatar";
import TeacherAvatar from "src/components/TeacherAvatar/TeacherAvatar";

function PlayWithComputer() {
  const [gameResult, setGameResult] = useState<string | null>(null);
  const [showBoom, setShowBoom] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [showSideContent, setShowSideContent] = useState(true);
  const [threatInfo, setThreatInfo] = useState<ThreatInfo>({
    threatSquares: [],
    showHints: true, // Initially true since showSideContent starts as true
    kidsMode: false,
  });
  const { t } = useTranslation();
  const { level } = useParams<{ level: "easy" | "medium" | "hard" }>();

  const previousPage = "/play/computer";

  // Получаем настройки из конфигурации
  const [difficultyConfig, setDifficultyConfig] = useState<DifficultyLevel>(
    getDifficultySettings(level)
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Обновляем настройки при изменении уровня в URL
  useEffect(() => {
    const newConfig = getDifficultySettings(level);
    setDifficultyConfig(newConfig);

    // Update threatInfo with new kids mode setting
    setThreatInfo((prev) => ({
      ...prev,
      kidsMode: newConfig.engineSettings.kidsMode,
      showHints: newConfig.engineSettings.kidsMode ? showSideContent : false,
    }));
  }, [level, showSideContent]);

  const handleSettingsChange = (
    newEngineSettings: Partial<typeof difficultyConfig.engineSettings>
  ) => {
    setDifficultyConfig((prev) => ({
      ...prev,
      engineSettings: {
        ...prev.engineSettings,
        ...newEngineSettings,
      },
    }));
  };

  const handleGameEnd = (result: string) => {
    setGameResult(result);
    setShowBoom(true);
    setTimeout(() => setShowBoom(false), 500);
  };
  const handleReset = useCallback(() => {
    setResetKey((prev) => prev + 1);
    setGameResult(null);
    setShowBoom(false);
  }, []);

  const handleThreatsChange = useCallback((threats: ThreatInfo) => {
    setThreatInfo(threats);
  }, []);

  const handleQuestionButtonClick = useCallback(() => {
    const newShowSideContent = !showSideContent;
    setShowSideContent(newShowSideContent);

    // In kids mode, also control hints visibility
    if (difficultyConfig.engineSettings.kidsMode) {
      setThreatInfo((prev) => ({
        ...prev,
        showHints: newShowSideContent,
      }));
    }
  }, [showSideContent, difficultyConfig.engineSettings.kidsMode]);

  return (
    <PageContainer>
      <ContentContainer>
        <MainContent>
          <PageTitle title={t("play_with_computer")} />

          <BackButtonWrap>
            <BackButtonImage linkToPage={previousPage} />

            <GameControls>
              <SettingsButton
                kidsMode={difficultyConfig.engineSettings.kidsMode}
                onClick={() => setIsSettingsOpen(true)}
              >
                ⚙️
              </SettingsButton>
            </GameControls>
          </BackButtonWrap>

          <QuestionButtonWrap>
            <QuestionButton onClick={handleQuestionButtonClick} />
            {showSideContent && (
              <SideContent>
                {(() => {
                  const hintData = generateHints(threatInfo, t);
                  return (
                    <Description
                      title={hintData.title}
                      hints={hintData.hints}
                    />
                  );
                })()}
              </SideContent>
            )}
          </QuestionButtonWrap>
          <ChessBoardWrapper>
            <UserAvatar />
            <ComputerChessBoard
              key={resetKey}
              settings={difficultyConfig.engineSettings}
              uiSettings={difficultyConfig.uiSettings}
              onGameEnd={handleGameEnd}
              onThreatsChange={handleThreatsChange}
              showHints={threatInfo.showHints}
            />
            <TeacherAvatar />
          </ChessBoardWrapper>

          {/* Game Settings Modal - выключаю из отображения времмено эта информация ненужна */}
          <GameSettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            difficultyConfig={difficultyConfig}
            onSettingsChange={handleSettingsChange}
          />

          {gameResult && (
            <>
              <GameCompleteMessage>{gameResult}</GameCompleteMessage>
              <ResetButton onClick={handleReset}>{t("play_again")}</ResetButton>
            </>
          )}
          {showBoom && <BoomAnimation>{t("boom")}</BoomAnimation>}
          {/* {gameComplete && <GameComplete gameStatus={currentGameStatus} />} */}
          <ResetButton onClick={handleReset}>{t("reset")}</ResetButton>
        </MainContent>
      </ContentContainer>
    </PageContainer>
  );
}
export default PlayWithComputer;
