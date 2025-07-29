import { useState, useEffect } from "react";
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

  const handleReset = () => {
    window.location.reload();
  };

  return (
    <PageContainer>
      <ContentContainer>
        <MainContent>
          <PageTitle title={t("play_with_computer")} />

          {/* Показываем информацию о выбранном уровне */}
          <div
            style={{
              textAlign: "center",
              margin: "20px 0",
              padding: "15px",
              borderRadius: "15px",
              background:
                difficultyConfig.id === "easy"
                  ? "#E8F5E8"
                  : difficultyConfig.id === "medium"
                  ? "#FFF3E0"
                  : "#FFEBEE",
              border: `2px solid ${
                difficultyConfig.id === "easy"
                  ? "#4CAF50"
                  : difficultyConfig.id === "medium"
                  ? "#FF9800"
                  : "#F44336"
              }`,
            }}
          >
            <div
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                marginBottom: "5px",
              }}
            >
              {difficultyConfig.ageGroup}
            </div>
            <div style={{ fontSize: "14px", color: "#666" }}>
              {difficultyConfig.features}
            </div>
          </div>

          <BackButtonWrap>
            <BackButtonImage linkToPage={previousPage} />
          </BackButtonWrap>

          <div className="game-controls">
            <button
              className="settings-button"
              onClick={() => setIsSettingsOpen(true)}
              style={{
                padding: "10px 20px",
                borderRadius: "25px",
                border: "none",
                background: difficultyConfig.engineSettings.kidsMode
                  ? "#FF6B6B"
                  : "#4CAF50",
                color: "white",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              ⚙️ {t("settings")}
            </button>
          </div>

          <ComputerChessBoard
            settings={difficultyConfig.engineSettings}
            uiSettings={difficultyConfig.uiSettings}
            onGameEnd={handleGameEnd}
          />

          {isSettingsOpen && (
            <div
              className="settings-modal"
              style={{
                position: "fixed",
                top: "0",
                left: "0",
                right: "0",
                bottom: "0",
                background: "rgba(0,0,0,0.7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
              }}
            >
              <div
                className="settings-content"
                style={{
                  background: "white",
                  padding: "30px",
                  borderRadius: "20px",
                  minWidth: "400px",
                  maxWidth: "500px",
                  maxHeight: "80vh",
                  overflowY: "auto",
                }}
              >
                <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
                  {t("game_settings")}
                </h2>

                {/* Информация о текущем уровне */}
                <div
                  style={{
                    marginBottom: "25px",
                    padding: "15px",
                    background: "#f8f9fa",
                    borderRadius: "10px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: "bold",
                      marginBottom: "5px",
                    }}
                  >
                    {difficultyConfig.ageGroup}
                  </div>
                  <div style={{ fontSize: "14px", color: "#666" }}>
                    {difficultyConfig.features}
                  </div>
                </div>

                {/* Дополнительные настройки (только для hard режима) */}
                {difficultyConfig.id === "hard" && (
                  <>
                    <div
                      className="setting-item"
                      style={{ marginBottom: "20px" }}
                    >
                      <label
                        style={{
                          display: "block",
                          marginBottom: "5px",
                          fontWeight: "bold",
                        }}
                      >
                        {SETTING_DESCRIPTIONS.skill.name}:{" "}
                        {difficultyConfig.engineSettings.skill}
                      </label>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#666",
                          marginBottom: "10px",
                        }}
                      >
                        {SETTING_DESCRIPTIONS.skill.description}
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="20"
                        value={difficultyConfig.engineSettings.skill}
                        onChange={(e) =>
                          handleSettingsChange({
                            skill: Number(e.target.value),
                          })
                        }
                        style={{ width: "100%" }}
                      />
                    </div>

                    <div
                      className="setting-item"
                      style={{ marginBottom: "20px" }}
                    >
                      <label
                        style={{
                          display: "block",
                          marginBottom: "5px",
                          fontWeight: "bold",
                        }}
                      >
                        {SETTING_DESCRIPTIONS.depth.name}:{" "}
                        {difficultyConfig.engineSettings.depth}
                      </label>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#666",
                          marginBottom: "10px",
                        }}
                      >
                        {SETTING_DESCRIPTIONS.depth.description}
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="20"
                        value={difficultyConfig.engineSettings.depth}
                        onChange={(e) =>
                          handleSettingsChange({
                            depth: Number(e.target.value),
                          })
                        }
                        style={{ width: "100%" }}
                      />
                    </div>

                    <div
                      className="setting-item"
                      style={{ marginBottom: "20px" }}
                    >
                      <label
                        style={{
                          display: "block",
                          marginBottom: "5px",
                          fontWeight: "bold",
                        }}
                      >
                        {SETTING_DESCRIPTIONS.time.name}:{" "}
                        {difficultyConfig.engineSettings.time}ms
                      </label>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#666",
                          marginBottom: "10px",
                        }}
                      >
                        {SETTING_DESCRIPTIONS.time.description}
                      </div>
                      <input
                        type="range"
                        min="100"
                        max="5000"
                        step="100"
                        value={difficultyConfig.engineSettings.time}
                        onChange={(e) =>
                          handleSettingsChange({ time: Number(e.target.value) })
                        }
                        style={{ width: "100%" }}
                      />
                    </div>
                  </>
                )}

                {/* Информация для детских режимов */}
                {(difficultyConfig.id === "easy" ||
                  difficultyConfig.id === "medium") && (
                  <div
                    style={{
                      padding: "15px",
                      background: "#fff3e0",
                      borderRadius: "10px",
                      marginBottom: "20px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#e65100",
                        textAlign: "center",
                      }}
                    >
                      ℹ️ В детском режиме настройки оптимизированы для обучения.
                      <br />
                      Для изменения сложности вернитесь к выбору уровня.
                    </div>
                  </div>
                )}

                {/* Показать текущие настройки движка */}
                <div
                  style={{
                    padding: "15px",
                    background: "#f8f9fa",
                    borderRadius: "10px",
                    marginBottom: "20px",
                    fontSize: "12px",
                  }}
                >
                  <h4 style={{ margin: "0 0 10px 0" }}>
                    Текущие настройки движка:
                  </h4>
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
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    justifyContent: "center",
                    marginTop: "25px",
                  }}
                >
                  <button
                    onClick={() => setIsSettingsOpen(false)}
                    style={{
                      padding: "10px 20px",
                      borderRadius: "20px",
                      border: "none",
                      background: "#4CAF50",
                      color: "white",
                      cursor: "pointer",
                      fontSize: "16px",
                    }}
                  >
                    ✅ Готово
                  </button>
                </div>
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
          <ResetButton onClick={() => window.location.reload()}>
            {t("reset")}
          </ResetButton>
        </MainContent>
      </ContentContainer>
    </PageContainer>
  );
}

export default PlayWithComputer;
