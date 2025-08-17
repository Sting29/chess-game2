import { useTranslation } from "react-i18next";
import { MazeCountersContainer, MazeCounter } from "./styles";

interface MazeCountersProps {
  remainingCheckpoints: number;
  remainingMoves?: number | null;
  remainingTime?: number | null;
}

export function MazeCounters({
  remainingCheckpoints,
  remainingMoves,
  remainingTime,
}: MazeCountersProps) {
  const { t } = useTranslation();

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <MazeCountersContainer>
      {remainingCheckpoints > 0 && (
        <MazeCounter className="checkpoints">
          {t("checkpoints_remaining", { count: remainingCheckpoints })}
        </MazeCounter>
      )}

      {remainingMoves !== undefined && remainingMoves !== null && (
        <MazeCounter className="moves">
          {t("moves_remaining", { count: remainingMoves })}
        </MazeCounter>
      )}

      {remainingTime !== undefined && remainingTime !== null && (
        <MazeCounter className="time">
          {t("time_remaining", { time: formatTime(remainingTime) })}
        </MazeCounter>
      )}
    </MazeCountersContainer>
  );
}
