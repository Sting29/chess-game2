import PawnWhiteClassic from "src/assets/figures/pawn_white_classic.png";
import PawnBlackClassic from "src/assets/figures/pawn_dark_classic.png";
import RookWhiteClassic from "src/assets/figures/rook_white_classic.png";
import RookBlackClassic from "src/assets/figures/rook_dark_classic.png";
import KnightWhiteClassic from "src/assets/figures/knight_white_classic.png";
import KnightBlackClassic from "src/assets/figures/knight_dark_classic.png";
import BishopWhiteClassic from "src/assets/figures/bishop_white_classic.png";
import BishopBlackClassic from "src/assets/figures/bishop_dark_classic.png";
import QueenWhiteClassic from "src/assets/figures/queen_white_classic_v1.png";
import QueenBlackClassic from "src/assets/figures/queen_dark_classic_v1.png";
import KingWhiteClassic from "src/assets/figures/king_white_classic_v1.png";
import KingBlackClassic from "src/assets/figures/king_dark_classic_v1.png";
import PawnWhiteHeroes from "src/assets/figures/pawn_white.png";
import PawnBlackHeroes from "src/assets/figures/pawn_dark.png";
import RookWhiteHeroes from "src/assets/figures/rook_white.png";
import RookBlackHeroes from "src/assets/figures/rook_dark.png";
import KnightWhiteHeroes from "src/assets/figures/knight_white.png";
import KnightBlackHeroes from "src/assets/figures/knight_dark.png";
import BishopWhiteHeroes from "src/assets/figures/bishop_white.png";
import BishopBlackHeroes from "src/assets/figures/bishop_dark.png";
import QueenWhiteHeroes from "src/assets/figures/queen_white.png";
import QueenBlackHeroes from "src/assets/figures/queen_dark.png";
import KingWhiteHeroes from "src/assets/figures/king_white.png";
import KingBlackHeroes from "src/assets/figures/king_dark.png";

export const FIGURES_SETS = [
  {
    id: "1",
    name: "classic",
    white: [
      { figure: "pawn", image: PawnWhiteClassic },
      { figure: "rook", image: RookWhiteClassic },
      { figure: "knight", image: KnightWhiteClassic },
      { figure: "bishop", image: BishopWhiteClassic },
      { figure: "queen", image: QueenWhiteClassic },
      { figure: "king", image: KingWhiteClassic },
    ],
    black: [
      { figure: "pawn", image: PawnBlackClassic },
      { figure: "rook", image: RookBlackClassic },
      { figure: "knight", image: KnightBlackClassic },
      { figure: "bishop", image: BishopBlackClassic },
      { figure: "queen", image: QueenBlackClassic },
      { figure: "king", image: KingBlackClassic },
    ],
    chessSet: {
      wP: PawnWhiteClassic,
      wN: KnightWhiteClassic,
      wB: BishopWhiteClassic,
      wR: RookWhiteClassic,
      wQ: QueenWhiteClassic,
      wK: KingWhiteClassic,
      bP: PawnBlackClassic,
      bN: KnightBlackClassic,
      bB: BishopBlackClassic,
      bR: RookBlackClassic,
      bQ: QueenBlackClassic,
      bK: KingBlackClassic,
    },
  },
  {
    id: "2",
    name: "heroes",
    white: [
      { figure: "pawn", image: PawnWhiteHeroes },
      { figure: "rook", image: RookWhiteHeroes },
      { figure: "knight", image: KnightWhiteHeroes },
      { figure: "bishop", image: BishopWhiteHeroes },
      { figure: "queen", image: QueenWhiteHeroes },
      { figure: "king", image: KingWhiteHeroes },
    ],
    black: [
      { figure: "pawn", image: PawnBlackHeroes },
      { figure: "rook", image: RookBlackHeroes },
      { figure: "knight", image: KnightBlackHeroes },
      { figure: "bishop", image: BishopBlackHeroes },
      { figure: "queen", image: QueenBlackHeroes },
      { figure: "king", image: KingBlackHeroes },
    ],
    chessSet: {
      wP: PawnWhiteHeroes,
      wN: KnightWhiteHeroes,
      wB: BishopWhiteHeroes,
      wR: RookWhiteHeroes,
      wQ: QueenWhiteHeroes,
      wK: KingWhiteHeroes,
      bP: PawnBlackHeroes,
      bN: KnightBlackHeroes,
      bB: BishopBlackHeroes,
      bR: RookBlackHeroes,
      bQ: QueenBlackHeroes,
      bK: KingBlackHeroes,
    },
  },
  {
    id: "3",
    name: "classic_heroes_kink_and_queen",
    white: [
      { figure: "pawn", image: PawnWhiteClassic },
      { figure: "rook", image: RookWhiteClassic },
      { figure: "knight", image: KnightWhiteClassic },
      { figure: "bishop", image: BishopWhiteClassic },
      { figure: "queen", image: QueenWhiteHeroes },
      { figure: "king", image: KingWhiteHeroes },
    ],
    black: [
      { figure: "pawn", image: PawnBlackClassic },
      { figure: "rook", image: RookBlackClassic },
      { figure: "knight", image: KnightBlackClassic },
      { figure: "bishop", image: BishopBlackClassic },
      { figure: "queen", image: QueenBlackHeroes },
      { figure: "king", image: KingBlackHeroes },
    ],
    chessSet: {
      wP: PawnWhiteClassic,
      wN: KnightWhiteClassic,
      wB: BishopWhiteClassic,
      wR: RookWhiteClassic,
      wQ: QueenWhiteHeroes,
      wK: KingWhiteHeroes,
      bP: PawnBlackClassic,
      bN: KnightBlackClassic,
      bB: BishopBlackClassic,
      bR: RookBlackClassic,
      bQ: QueenBlackHeroes,
      bK: KingBlackHeroes,
    },
  },
];
