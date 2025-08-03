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
  SettingsModal,
  SettingsContent,
  SettingsTitle,
  LevelInfo,
  LevelTitle,
  LevelDescription,
  SettingItem,
  SettingLabel,
  SettingDescription,
  SettingSlider,
  KidsInfoBlock,
  KidsInfoText,
  CurrentSettingsBlock,
  CurrentSettingsTitle,
  ButtonContainer,
  CloseButton,
} from "./styles";
import { PageTitle } from "src/components/PageTitle/PageTitle";
import { BackButtonWrap } from "src/components/BackButtonImage/styles";
import BackButtonImage from "src/components/BackButtonImage/BackButtonImage";
import {
  getDifficultySettings,
  DifficultyLevel,
  SETTING_DESCRIPTIONS,
} from "src/config/gameSettings";

function PlayWithComputer() {
  const [gameResult, setGameResult] = useState<string | null>(null);
  const [showBoom, setShowBoom] = useState(false);
  const [resetKey, setResetKey] = useState(0);
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
    setDifficultyConfig(getDifficultySettings(level));
  }, [level]);

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
                ⚙️ {t("settings")}
              </SettingsButton>
            </GameControls>
          </BackButtonWrap>

          <ComputerChessBoard
            key={resetKey}
            settings={difficultyConfig.engineSettings}
            uiSettings={difficultyConfig.uiSettings}
            onGameEnd={handleGameEnd}
          />

          {isSettingsOpen && (
            <SettingsModal>
              <SettingsContent>
                <SettingsTitle>{t("game_settings")}</SettingsTitle>

                {/* Информация о текущем уровне */}
                <LevelInfo>
                  <LevelTitle>{difficultyConfig.ageGroup}</LevelTitle>
                  <LevelDescription>
                    {difficultyConfig.features}
                  </LevelDescription>
                </LevelInfo>

                {/* Дополнительные настройки (только для hard режима) */}
                {difficultyConfig.id === "hard" && (
                  <>
                    <SettingItem>
                      <SettingLabel>
                        {SETTING_DESCRIPTIONS.skill.name}:{" "}
                        {difficultyConfig.engineSettings.skill}
                      </SettingLabel>
                      <SettingDescription>
                        {SETTING_DESCRIPTIONS.skill.description}
                      </SettingDescription>
                      <SettingSlider
                        type="range"
                        min="0"
                        max="20"
                        value={difficultyConfig.engineSettings.skill}
                        onChange={(e) =>
                          handleSettingsChange({
                            skill: Number(e.target.value),
                          })
                        }
                      />
                    </SettingItem>

                    <SettingItem>
                      <SettingLabel>
                        {SETTING_DESCRIPTIONS.depth.name}:{" "}
                        {difficultyConfig.engineSettings.depth}
                      </SettingLabel>
                      <SettingDescription>
                        {SETTING_DESCRIPTIONS.depth.description}
                      </SettingDescription>
                      <SettingSlider
                        type="range"
                        min="1"
                        max="20"
                        value={difficultyConfig.engineSettings.depth}
                        onChange={(e) =>
                          handleSettingsChange({
                            depth: Number(e.target.value),
                          })
                        }
                      />
                    </SettingItem>

                    <SettingItem>
                      <SettingLabel>
                        {SETTING_DESCRIPTIONS.time.name}:{" "}
                        {difficultyConfig.engineSettings.time}ms
                      </SettingLabel>
                      <SettingDescription>
                        {SETTING_DESCRIPTIONS.time.description}
                      </SettingDescription>
                      <SettingSlider
                        type="range"
                        min="100"
                        max="5000"
                        step="100"
                        value={difficultyConfig.engineSettings.time}
                        onChange={(e) =>
                          handleSettingsChange({ time: Number(e.target.value) })
                        }
                      />
                    </SettingItem>
                  </>
                )}

                {/* Информация для детских режимов */}
                {(difficultyConfig.id === "easy" ||
                  difficultyConfig.id === "medium") && (
                  <KidsInfoBlock>
                    <KidsInfoText>
                      ℹ️ В детском режиме настройки оптимизированы для обучения.
                      <br />
                      Для изменения сложности вернитесь к выбору уровня.
                    </KidsInfoText>
                  </KidsInfoBlock>
                )}

                {/* Показать текущие настройки движка */}
                <CurrentSettingsBlock>
                  <CurrentSettingsTitle>
                    Текущие настройки движка:
                  </CurrentSettingsTitle>
                  <div>• Навык: {difficultyConfig.engineSettings.skill}/20</div>
                  <div>• Глубина: {difficultyConfig.engineSettings.depth}</div>
                  <div>• Время: {difficultyConfig.engineSettings.time}ms</div>
                  <div>• Потоки: {difficultyConfig.engineSettings.threads}</div>
                  <div>
                    • Детский режим:{" "}
                    {difficultyConfig.engineSettings.kidsMode ? "Да" : "Нет"}
                  </div>
                  <div>
                    • Стрелка хода:{" "}
                    {difficultyConfig.uiSettings.showLastMoveArrow
                      ? "Да"
                      : "Нет"}
                  </div>
                </CurrentSettingsBlock>

                <ButtonContainer>
                  <CloseButton onClick={() => setIsSettingsOpen(false)}>
                    ✅ Готово
                  </CloseButton>
                </ButtonContainer>
              </SettingsContent>
            </SettingsModal>
          )}
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
