import { useMemo } from "react";
import type { ReactElement } from "react";
import { useSelector } from "react-redux";

import { FIGURES_SETS } from "src/data/figures-sets";
import { RootState } from "src/store";

export function useCustomPieces() {
  const currentChessSet = useSelector(
    (state: RootState) => state.settings.chessSet
  );
  const pieceImages = FIGURES_SETS[Number(currentChessSet) - 1].chessSet;

  return useMemo(() => {
    const pieces = Object.keys(pieceImages);
    const pieceComponents: {
      [key: string]: ({
        squareWidth,
      }: {
        squareWidth: number;
      }) => ReactElement | null;
    } = {};

    pieces.forEach((piece) => {
      pieceComponents[piece] = ({ squareWidth }) => {
        const pieceImage = pieceImages[piece as keyof typeof pieceImages];

        // Check if it's a string (PNG image) or function (SVG component)
        if (typeof pieceImage === "string") {
          return (
            <img
              src={pieceImage}
              alt={piece}
              style={{
                width: squareWidth,
                height: squareWidth,
                backgroundSize: "100%",
              }}
            />
          );
        } else if (typeof pieceImage === "function") {
          // Determine piece color for SVG fill
          const isWhite = piece.startsWith("w");
          const fill = isWhite ? "#ffffff" : "#000000";

          return (
            <div
              style={{
                width: squareWidth,
                height: squareWidth,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {pieceImage({
                fill,
                svgStyle: {
                  width: "100%",
                  height: "100%",
                },
              })}
            </div>
          );
        }

        // Fallback for unknown piece types
        return (
          <div
            style={{
              width: squareWidth,
              height: squareWidth,
              backgroundColor: "#ccc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
            }}
          >
            ?
          </div>
        );
      };
    });

    return pieceComponents;
  }, [pieceImages]);
}
