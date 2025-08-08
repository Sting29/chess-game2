import React from "react";
import { useTranslation } from "react-i18next";
import {
  DifficultyLevel,
  SETTING_DESCRIPTIONS,
  GameEngineSettings,
} from "src/data/play-with-computer";
import {
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

interface GameSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  difficultyConfig: DifficultyLevel;
  onSettingsChange: (newSettings: Partial<GameEngineSettings>) => void;
}

const GameSettingsModal: React.FC<GameSettingsModalProps> = ({
  isOpen,
  onClose,
  difficultyConfig,
  onSettingsChange,
}) => {
  const { t } = useTranslation();

  // Helper function to get translated setting descriptions
  const getSettingName = (
    settingKey: keyof typeof SETTING_DESCRIPTIONS
  ): string => {
    return t(SETTING_DESCRIPTIONS[settingKey].nameKey);
  };

  const getSettingDescription = (
    settingKey: keyof typeof SETTING_DESCRIPTIONS
  ): string => {
    return t(SETTING_DESCRIPTIONS[settingKey].descriptionKey);
  };

  if (!isOpen) return null;

  return (
    <SettingsModal>
      <SettingsContent>
        <SettingsTitle>{t("game_settings")}</SettingsTitle>

        {/* Информация о текущем уровне */}
        <LevelInfo>
          <LevelTitle>{t(difficultyConfig.ageGroupKey)}</LevelTitle>
          <LevelDescription>{t(difficultyConfig.featuresKey)}</LevelDescription>
        </LevelInfo>

        {/* Дополнительные настройки (только для hard режима) */}
        {difficultyConfig.id === "hard" && (
          <>
            <SettingItem>
              <SettingLabel>
                {getSettingName("skill")}:{" "}
                {difficultyConfig.engineSettings.skill}
              </SettingLabel>
              <SettingDescription>
                {getSettingDescription("skill")}
              </SettingDescription>
              <SettingSlider
                type="range"
                min="0"
                max="20"
                value={difficultyConfig.engineSettings.skill}
                onChange={(e) =>
                  onSettingsChange({
                    skill: Number(e.target.value),
                  })
                }
              />
            </SettingItem>

            <SettingItem>
              <SettingLabel>
                {getSettingName("depth")}:{" "}
                {difficultyConfig.engineSettings.depth}
              </SettingLabel>
              <SettingDescription>
                {getSettingDescription("depth")}
              </SettingDescription>
              <SettingSlider
                type="range"
                min="1"
                max="20"
                value={difficultyConfig.engineSettings.depth}
                onChange={(e) =>
                  onSettingsChange({
                    depth: Number(e.target.value),
                  })
                }
              />
            </SettingItem>

            <SettingItem>
              <SettingLabel>
                {getSettingName("time")}: {difficultyConfig.engineSettings.time}
                ms
              </SettingLabel>
              <SettingDescription>
                {getSettingDescription("time")}
              </SettingDescription>
              <SettingSlider
                type="range"
                min="100"
                max="5000"
                step="100"
                value={difficultyConfig.engineSettings.time}
                onChange={(e) =>
                  onSettingsChange({ time: Number(e.target.value) })
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
              {t("kids_mode_settings_info")}
              <br />
              {t("kids_mode_change_difficulty")}
            </KidsInfoText>
          </KidsInfoBlock>
        )}

        {/* Показать текущие настройки движка */}
        <CurrentSettingsBlock>
          <CurrentSettingsTitle>
            {t("current_engine_settings")}
          </CurrentSettingsTitle>
          <div>
            {t("setting_skill")} {difficultyConfig.engineSettings.skill}/20
          </div>
          <div>
            {t("setting_depth")} {difficultyConfig.engineSettings.depth}
          </div>
          <div>
            {t("setting_time")} {difficultyConfig.engineSettings.time}ms
          </div>
          <div>
            {t("setting_threads")} {difficultyConfig.engineSettings.threads}
          </div>
          <div>
            {t("setting_kids_mode")}{" "}
            {difficultyConfig.engineSettings.kidsMode ? t("yes") : t("no")}
          </div>
          <div>
            {t("setting_last_move_arrow")}{" "}
            {difficultyConfig.uiSettings.showLastMoveArrow ? t("yes") : t("no")}
          </div>
        </CurrentSettingsBlock>

        <ButtonContainer>
          <CloseButton onClick={onClose}>{t("done")}</CloseButton>
        </ButtonContainer>
      </SettingsContent>
    </SettingsModal>
  );
};

export default GameSettingsModal;
