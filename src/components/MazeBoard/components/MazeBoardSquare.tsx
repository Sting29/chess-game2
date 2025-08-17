import React from "react";
import { Square } from "../../../types/types";
import { BoardSquare, PieceElement, HintDot } from "../styles";
import { SquareContent } from "./SquareContent";

interface SquareContentData {
  type: "piece" | "wall" | "exit" | "checkpoint" | "empty";
  content: string | null;
  active?: boolean;
}

interface MazeBoardSquareProps {
  square: Square;
  color: "light" | "dark";
  content: SquareContentData;
  isSelected: boolean;
  isHighlighted: boolean;
  onClick: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

export const MazeBoardSquare: React.FC<MazeBoardSquareProps> = ({
  square,
  color,
  content,
  isSelected,
  isHighlighted,
  onClick,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
}) => {
  return (
    <BoardSquare
      $color={color}
      $selected={isSelected}
      $highlighted={isHighlighted}
      onClick={onClick}
      onDragOver={onDragOver}
      onDrop={onDrop}
      $contentType={content.type}
      $active={content.active}
    >
      {content.type === "piece" && content.content && (
        <PieceElement draggable onDragStart={onDragStart} onDragEnd={onDragEnd}>
          <SquareContent
            type={content.type}
            content={content.content}
            active={content.active}
          />
        </PieceElement>
      )}

      {content.type !== "piece" && (
        <SquareContent
          type={content.type}
          content={content.content}
          active={content.active}
        />
      )}

      {isHighlighted && !isSelected && (
        <HintDot
          $hasPiece={
            content.type === "checkpoint" ||
            (content.type === "exit" && content.active === true)
          }
        />
      )}
    </BoardSquare>
  );
};
