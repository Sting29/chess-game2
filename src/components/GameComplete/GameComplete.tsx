import { FC } from "react";
import { GameCompleteWrap } from "./styles";

interface GameCompleteProps {
  gameStatus: "playing" | "white_wins" | "black_wins" | "draw";
}

const GameComplete: FC<GameCompleteProps> = ({ gameStatus }) => {
  let message = "Игра завершена!";
  if (gameStatus === "playing") return null;
  if (gameStatus === "white_wins") {
    message = "Победа белых!";
  } else if (gameStatus === "black_wins") {
    message = "Победа черных!";
  } else if (gameStatus === "draw") {
    message = "Ничья!";
  }

  return <GameCompleteWrap>{message}</GameCompleteWrap>;
};

export default GameComplete;
