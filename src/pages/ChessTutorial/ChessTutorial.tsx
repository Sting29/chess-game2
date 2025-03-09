import { useNavigate } from "react-router-dom";
import {
  ChessTutorialLinks,
  ChessTutorialTitle,
  ChessTutorialWrap,
} from "./styles";
import HowToMoveImg from "src/assets/images/how_to_move.jpg";
import HowToPlayImg from "src/assets/images/how_to_play.jpg";
import PuzzlesImg from "src/assets/images/puzzles.jpg";
import PlayWithComputerImg from "src/assets/images/chess_game.jpg";
import ChessTutorialButton from "../../components/ChessTutorialButton/ChessTutorialButton";

const pages = [
  { path: "/how-to-move", title: "How to Move", image: HowToMoveImg },
  { path: "/how-to-play", title: "How to Play", image: HowToPlayImg },
  { path: "/puzzles", title: "Chess Puzzles", image: PuzzlesImg },
  {
    path: "/play-with-computer",
    title: "Play with Computer",
    image: PlayWithComputerImg,
  },
];

function ChessTutorial() {
  const navigate = useNavigate();

  return (
    <ChessTutorialWrap>
      <ChessTutorialTitle>Choose Your Story</ChessTutorialTitle>

      <ChessTutorialLinks>
        {pages.map((page) => (
          <ChessTutorialButton
            key={page.path}
            title={page.title}
            image={page.image}
            onClick={() => navigate(page.path)}
          />
        ))}
      </ChessTutorialLinks>
    </ChessTutorialWrap>
  );
}

export default ChessTutorial;
