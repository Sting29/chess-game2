import { useMemo } from "react";
import type { ReactElement } from "react";
import { useSelector } from "react-redux";

import { FIGURES_SETS } from "src/data/figures-sets";
import { RootState } from "src/store";

// import { chessSet4 } from "./chessSet4";
// import { chessSet1 } from "./chessSet1";

export function useCustomPieces() {
  const currentChessSet = useSelector(
    (state: RootState) => state.settings.chessSet
  );
  const pieceImages = FIGURES_SETS[Number(currentChessSet) - 1].chessSet;

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
  }, [pieceImages]);
}
