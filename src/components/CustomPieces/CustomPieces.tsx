import { useMemo } from "react";
import type { ReactElement } from "react";

// import { chessSet4 } from "./chessSet4";
import { chessSet1 } from "./chessSet1";

export function useCustomPieces() {
  const pieceImages = chessSet1;

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
