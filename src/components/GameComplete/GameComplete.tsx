import { FC } from "react";
import { GameCompleteWrap } from "./styles";

interface GameCompleteProps {
  gameStatus: "playing" | "white_wins" | "black_wins" | "draw";
}

const GameComplete: FC<GameCompleteProps> = ({ gameStatus }) => {
  let message = "Game over!";
  if (gameStatus === "playing") return null;
  if (gameStatus === "white_wins") {
    message = "White wins!";
  } else if (gameStatus === "black_wins") {
    message = "Black wins!";
  } else if (gameStatus === "draw") {
    message = "Draw!";
  }

  return <GameCompleteWrap>{message}</GameCompleteWrap>;
};

export default GameComplete;
