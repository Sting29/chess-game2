import ChessPawn from "src/assets/images/slides/slide_pawn.png";
import ChessKnight from "src/assets/images/slides/slide_knight.png";

export const HOW_TO_PLAY = [
  {
    path: `/pawn-battle`,
    title: "Pawn Battle",
    image: ChessPawn,
    widgetSize: "large",
    initialPosition: "8/pppppppp/8/8/8/8/PPPPPPPP/8 w - - 0 1",
  },
  {
    path: `/knight-battle`,
    title: "Knight Battle",
    image: ChessKnight,
    widgetSize: "large",
    initialPosition: "1n4n1/8/8/8/8/8/8/1N4N1 w - - 0 1",
  },
];
