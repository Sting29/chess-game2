import { useTranslation } from "react-i18next";
import {
  MazeControlsContainer,
  HintToggleButton,
  RestartButton,
} from "./styles";

interface MazeControlsProps {
  showHints: boolean;
  onToggleHints: () => void;
  onRestart: () => void;
}

export function MazeControls({
  showHints,
  onToggleHints,
  onRestart,
}: MazeControlsProps) {
  const { t } = useTranslation();

  return (
    <MazeControlsContainer>
      <HintToggleButton onClick={onToggleHints} $active={showHints}>
        {showHints ? t("hide_hints") : t("show_hints")}
      </HintToggleButton>

      <RestartButton onClick={onRestart}>{t("start_over")}</RestartButton>
    </MazeControlsContainer>
  );
}
