import { useMemo } from "react";
import type { ReactElement } from "react";
// White pieces
import wP from "../../assets/figures/pawn_white.png";
import wN from "../../assets/figures/knight_white.png";
import wB from "../../assets/figures/bishop_white.png";
import wR from "../../assets/figures/rook_white.png";
import wQ from "../../assets/figures/queen_white.png";
// import wK from "../../assets/figures/king_white.png";

// Black pieces
import bP from "../../assets/figures/pawn_dark.png";
import bN from "../../assets/figures/knight_dark.png";
import bB from "../../assets/figures/bishop_dark.png";
import bR from "../../assets/figures/rook_dark.png";
import bQ from "../../assets/figures/queen_dark.png";
import bK from "../../assets/figures/king_dark.png";

const pieceImages = {
  wP,
  wN,
  wB,
  wR,
  wQ,
  // wK,
  bP,
  bN,
  bB,
  bR,
  bQ,
  bK,
} as const;

export function useCustomPieces() {
  return useMemo(() => {
    const pieces = Object.keys(pieceImages);
    const pieceComponents: {
      [key: string]: ({ squareWidth }: { squareWidth: number }) => ReactElement;
    } = {};

    pieces.forEach((piece) => {
      pieceComponents[piece] = ({ squareWidth }) => (
        <img
          src={pieceImages[piece as keyof typeof pieceImages]}
          alt={piece}
          style={{
            width: squareWidth,
            height: squareWidth,
            backgroundSize: "100%",
          }}
        />
      );
    });

    return pieceComponents;
  }, []);
}
