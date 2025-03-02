import { useState } from "react";
import { ComputerChessBoard } from "../components/ComputerChessBoard";
import BackButton from "../components/BackButton/BackButton";

interface GameSettings {
  depth: number; // глубина расчета (1-20)
  skill: number; // уровень сложности (0-20)
}

function PlayWithComputer() {
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
      <h1>Игра с компьютером</h1>
      <BackButton linkToPage="/" />

      <div className="game-controls">
        <button
          className="settings-button"
          onClick={() => setIsSettingsOpen(true)}
        >
          Настройки
        </button>
      </div>

      <ComputerChessBoard settings={settings} />

      {isSettingsOpen && (
        <div className="settings-modal">
          <div className="settings-content">
            <h2>Настройки игры</h2>

            <div className="setting-item">
              <label>Глубина расчета: {settings.depth}</label>
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
              <label>Уровень сложности: {settings.skill}</label>
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
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlayWithComputer;
