import React from "react";
import { useCustomPieces } from "../../CustomPieces/CustomPieces";

interface PieceRendererProps {
  piece: string;
}

export const PieceRenderer: React.FC<PieceRendererProps> = ({ piece }) => {
  const customPieces = useCustomPieces();

  // Convert single character piece notation to custom pieces format
  // Uppercase = white, lowercase = black
  const isWhite = piece === piece.toUpperCase();
  const pieceType = piece.toUpperCase();
  const pieceKey = `${isWhite ? "w" : "b"}${pieceType}`;

  if (customPieces && customPieces[pieceKey]) {
    return <>{customPieces[pieceKey]()}</>;
  }

  // Fallback to text display
  return (
    <div
      style={{
        fontSize: "40px",
        lineHeight: "1",
        textAlign: "center",
        color: isWhite ? "#fff" : "#000",
        textShadow: isWhite ? "1px 1px 1px #000" : "1px 1px 1px #fff",
      }}
    >
      {piece}
    </div>
  );
};
