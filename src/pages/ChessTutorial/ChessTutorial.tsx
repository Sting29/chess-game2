import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ChessTutorialButton,
  ChessTutorialLinks,
  ChessTutorialTitle,
  ChessTutorialWrap,
  LinkHeader,
} from "./styles";
import Image from "../../components/Image/Image";
import HowToMoveImg from "src/assets/images/how_to_move.jpg";
import HowToPlayImg from "src/assets/images/how_to_play.jpg";
import PuzzlesImg from "src/assets/images/puzzles.jpg";
import PlayWithComputerImg from "src/assets/images/chess_game.jpg";

function ChessTutorial() {
  const navigate = useNavigate();

  return (
    <ChessTutorialWrap>
      <ChessTutorialTitle>Choose Your Story</ChessTutorialTitle>

      <ChessTutorialLinks>
        <ChessTutorialButton onClick={() => navigate("/how-to-move")}>
          <LinkHeader>How to Move</LinkHeader>
          <Image src={HowToMoveImg} height={200} />
        </ChessTutorialButton>

        <ChessTutorialButton onClick={() => navigate("/how-to-play")}>
          <LinkHeader>How to Play</LinkHeader>
          <Image src={HowToPlayImg} height={200} />
        </ChessTutorialButton>

        <ChessTutorialButton onClick={() => navigate("/puzzles")}>
          <LinkHeader>Chess Puzzles</LinkHeader>
          <Image src={PuzzlesImg} height={200} />
        </ChessTutorialButton>

        <ChessTutorialButton onClick={() => navigate("/play-with-computer")}>
          <LinkHeader>Play with Computer</LinkHeader>
          <Image src={PlayWithComputerImg} height={200} />
        </ChessTutorialButton>
      </ChessTutorialLinks>
    </ChessTutorialWrap>
  );
}

export default ChessTutorial;
