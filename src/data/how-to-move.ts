import ChessPawn from "src/assets/images/slides/slide_pawn.png";
import ChessRook from "src/assets/images/slides/slide_rook.png";
import ChessKnight from "src/assets/images/slides/slide_knight.png";
import ChessBishop from "src/assets/images/slides/slide_bishop.png";
import ChessQueen from "src/assets/images/slides/slide_queen.png";
import ChessKing from "src/assets/images/slides/slide_king.png";

export const HOW_TO_MOVE = [
  {
    id: "pawn-move",
    pageTitleKey: "how_to_move_pawn",
    descriptionTitleKey: "how_to_move_pawn_title",
    descriptionKey: "how_to_move_pawn_desc",
    initialPosition: "8/1p6/p7/8/8/8/1P6/8 w - - 0 1",
    image: ChessPawn,
  },
  {
    id: "rook-move",
    pageTitleKey: "how_to_move_rook",
    descriptionTitleKey: "how_to_move_rook_title",
    descriptionKey: "how_to_move_rook_desc",
    initialPosition: "8/8/p2p4/8/8/3p4/8/R7 w - - 0 1",
    image: ChessRook,
  },
  {
    id: "knight-move",
    pageTitleKey: "how_to_move_knight",
    descriptionTitleKey: "how_to_move_knight_title",
    descriptionKey: "how_to_move_knight_desc",
    initialPosition: "8/8/1p6/3p4/8/5p2/8/3K4 w - - 0 1",
    image: ChessKnight,
  },
  {
    id: "bishop-move",
    pageTitleKey: "how_to_move_bishop",
    descriptionTitleKey: "how_to_move_bishop_title",
    descriptionKey: "how_to_move_bishop_desc",
    initialPosition: "8/3p4/8/1p3p2/8/8/8/5B2 w - - 0 1",
    image: ChessBishop,
  },
  {
    id: "queen-move",
    pageTitleKey: "how_to_move_queen",
    descriptionTitleKey: "how_to_move_queen_title",
    descriptionKey: "how_to_move_queen_desc",
    initialPosition: "8/8/1p6/3p4/8/5p2/8/3Q4 w - - 0 1",
    image: ChessQueen,
  },
  {
    id: "king-move",
    pageTitleKey: "how_to_move_king",
    descriptionTitleKey: "how_to_move_king_title",
    descriptionKey: "how_to_move_king_desc",
    initialPosition: "8/8/1p6/3p4/8/5p2/8/3K4 w - - 0 1",
    image: ChessKing,
  },
];
