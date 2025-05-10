import ChessPawn from "src/assets/images/slides/slide_pawn.png";
import ChessKnight from "src/assets/images/slides/slide_knight.png";

export const HOW_TO_PLAY = [
  {
    id: `pawn-battle`,
    titleKey: "how_to_play_pawn_battle",
    image: ChessPawn,
    widgetSize: "large",
    initialPosition: "8/pppppppp/8/8/8/8/PPPPPPPP/8 w - - 0 1",
  },
  {
    id: `knight-battle`,
    titleKey: "how_to_play_knight_battle",
    image: ChessKnight,
    widgetSize: "large",
    initialPosition: "1n4n1/8/8/8/8/8/8/1N4N1 w - - 0 1",
  },
];
