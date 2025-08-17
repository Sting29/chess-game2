import { useState, useEffect, useRef } from "react";
import { MazeEngine } from "../../../utils/MazeEngine";

interface UseTimerProps {
  initialTime: number | null;
  engine: MazeEngine | null;
  onTimeUp: () => void;
}

export const useTimer = ({ initialTime, engine, onTimeUp }: UseTimerProps) => {
  const [currentTime, setCurrentTime] = useState<number | null>(initialTime);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (
      initialTime &&
      currentTime !== null &&
      currentTime > 0 &&
      engine &&
      !engine.isGameComplete() &&
      !engine.isGameFailed()
    ) {
      timerRef.current = setTimeout(() => {
        const newTime = currentTime - 1;
        setCurrentTime(newTime);
        engine.updateRemainingTime(newTime);

        if (newTime <= 0) {
          onTimeUp();
        }
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [currentTime, initialTime, engine, onTimeUp]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return { currentTime };
};
