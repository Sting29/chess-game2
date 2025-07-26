import { useState } from "react";
import { ComputerChessBoard } from "src/components/ComputerChessBoard/ComputerChessBoard";
import { useTranslation } from "react-i18next";
import {
  PageContainer,
  ContentContainer,
  MainContent,
  GameCompleteMessage,
  ResetButton,
  BoomAnimation,
} from "./styles";
import { PageTitle } from "src/components/PageTitle/PageTitle";
import { BackButtonWrap } from "src/components/BackButtonImage/styles";
import BackButtonImage from "src/components/BackButtonImage/BackButtonImage";

interface GameSettings {
  depth: number; // глубина расчета (1-20)
  skill: number; // уровень сложности (0-20)
}

function PlayWithComputer() {
  const [gameResult, setGameResult] = useState<string | null>(null);
  const [showBoom, setShowBoom] = useState(false);
  const { t } = useTranslation();

  const previousPage = "/play/computer";

  const [settings, setSettings] = useState<GameSettings>({
    depth: 10,
    skill: 10,
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleSettingsChange = (newSettings: Partial<GameSettings>) => {
    setSettings((prev) => ({
      ...prev,
      ...newSettings,
    }));
  };

  const handleGameEnd = (result: string) => {
    setGameResult(result);
    setShowBoom(true);
    setTimeout(() => setShowBoom(false), 500);
  };

  const handleReset = () => {
    window.location.reload();
  };

  return (
    <PageContainer>
      <ContentContainer>
        <MainContent>
          <PageTitle title={t("play_with_computer")} />
          <BackButtonWrap>
            <BackButtonImage linkToPage={previousPage} />
          </BackButtonWrap>

          <div className="game-controls">
            <button
              className="settings-button"
              onClick={() => setIsSettingsOpen(true)}
            >
              {t("settings")}
            </button>
          </div>

          <ComputerChessBoard settings={settings} onGameEnd={handleGameEnd} />

          {isSettingsOpen && (
            <div className="settings-modal">
              <div className="settings-content">
                <h2>{t("game_settings")}</h2>

                <div className="setting-item">
                  <label>
                    {t("calculation_depth")}: {settings.depth}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={settings.depth}
                    onChange={(e) =>
                      handleSettingsChange({ depth: Number(e.target.value) })
                    }
                  />
                </div>

                <div className="setting-item">
                  <label>
                    {t("difficulty_level")}: {settings.skill}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={settings.skill}
                    onChange={(e) =>
                      handleSettingsChange({ skill: Number(e.target.value) })
                    }
                  />
                </div>

                <button
                  className="close-button"
                  onClick={() => setIsSettingsOpen(false)}
                >
                  {t("close")}
                </button>
              </div>
            </div>
          )}
          {gameResult && (
            <>
              <GameCompleteMessage>{gameResult}</GameCompleteMessage>
              <ResetButton onClick={handleReset}>{t("play_again")}</ResetButton>
            </>
          )}
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

export default PlayWithComputer;
