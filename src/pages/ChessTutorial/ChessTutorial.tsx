import { useNavigate } from "react-router-dom";
import {
  ChessTutorialButton,
  ChessTutorialLinks,
  ChessTutorialTitle,
  ChessTutorialWrap,
} from "./styles";

function ChessTutorial() {
  const navigate = useNavigate();

  return (
    <ChessTutorialWrap>
      <ChessTutorialTitle>Шахматный Учебник</ChessTutorialTitle>

      <ChessTutorialLinks>
        <ChessTutorialButton onClick={() => navigate("/how-to-move")}>
          Как ходят фигуры
        </ChessTutorialButton>

        <ChessTutorialButton onClick={() => navigate("/how-to-play")}>
          Как играть в шахматы
        </ChessTutorialButton>
      </ChessTutorialLinks>
    </ChessTutorialWrap>
  );
}

export default ChessTutorial;
