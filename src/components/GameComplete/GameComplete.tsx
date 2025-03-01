import { FC } from "react";
import { GameCompleteWrap } from "./styles";

interface GameCompleteProps {
  gameStatus: "playing" | "white_wins" | "draw";
}

const GameComplete: FC<GameCompleteProps> = ({ gameStatus }) => {
  if (gameStatus === "playing") return null;
  return (
    <GameCompleteWrap>
      {gameStatus === "white_wins"
        ? "Победа! Все черные фигуры побиты."
        : "Пат! Нет больше возможных ходов."}
    </GameCompleteWrap>
  );
};

export default GameComplete;
