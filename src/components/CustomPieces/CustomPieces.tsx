import { useMemo } from "react";
import { useSelector } from "react-redux";

import { FIGURES_SETS } from "src/data/figures-sets";
import { RootState } from "src/store";

export function useCustomPieces() {
  const currentChessSet = useSelector(
    (state: RootState) => state.settings.chessSet
  );

  return useMemo(() => {
    const chessSetIndex = Number(currentChessSet) - 1;
    if (chessSetIndex < 0 || chessSetIndex >= FIGURES_SETS.length) {
      console.warn(`Invalid chess set index: ${chessSetIndex}, using default`);
      return {};
    }

    const figureSet = FIGURES_SETS[chessSetIndex];
    if (!figureSet || !figureSet.chessSet) {
      console.warn(`Chess set not found for index: ${chessSetIndex}`);
      return {};
    }

    const pieceImages = figureSet.chessSet;
    const pieces = Object.keys(pieceImages);
    const pieceComponents: {
      [key: string]: (props?: {
        fill?: string;
        svgStyle?: React.CSSProperties;
      }) => React.JSX.Element;
    } = {};

    pieces.forEach((piece) => {
      pieceComponents[piece] = (props) => {
        const pieceImage = pieceImages[piece as keyof typeof pieceImages];

        // Check if it's a string (PNG image)
        if (typeof pieceImage === "string") {
          return (
            <img
              src={pieceImage}
              alt={piece}
              style={{
                width: "100%",
                height: "100%",
                backgroundSize: "100%",
                ...props?.svgStyle,
              }}
            />
          );
        }

        // Check if it's a function (SVG component)
        if (typeof pieceImage === "function") {
          // Determine piece color for SVG fill
          const isWhite = piece.startsWith("w");
          const fill = props?.fill || (isWhite ? "#ffffff" : "#000000");

          return (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                ...props?.svgStyle,
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
              width: "100%",
              height: "100%",
              backgroundColor: "#ccc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              ...props?.svgStyle,
            }}
          >
            ?
          </div>
        );
      };
    });

    return pieceComponents;
  }, [currentChessSet]);
}
