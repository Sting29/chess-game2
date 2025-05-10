import { useState } from "react";
import { ComputerChessBoard } from "../components/ComputerChessBoard";
import BackButton from "../components/BackButton/BackButton";
import { useTranslation } from "react-i18next";

interface GameSettings {
  depth: number; // глубина расчета (1-20)
  skill: number; // уровень сложности (0-20)
}

function PlayWithComputer() {
  const { t } = useTranslation();
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

  return (
    <div className="tutorial-page">
      <h1>{t("play_with_computer")}</h1>
      <BackButton linkToPage="/" />

      <div className="game-controls">
        <button
          className="settings-button"
          onClick={() => setIsSettingsOpen(true)}
        >
          {t("settings")}
        </button>
      </div>

      <ComputerChessBoard settings={settings} />

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
    </div>
  );
}

export default PlayWithComputer;
