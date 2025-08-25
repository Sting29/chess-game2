import React from "react";
import { PieceRenderer } from "./PieceRenderer";
import checkpointImage from "src/assets/images/star.png";
import wallImage from "src/assets/images/wall.png";
import exitImage from "src/assets/images/door.png";

interface SquareContentProps {
  type: "piece" | "wall" | "exit" | "checkpoint" | "empty";
  content: string | null;
  active?: boolean;
}

export const SquareContent: React.FC<SquareContentProps> = ({
  type,
  content,
  active,
}) => {
  switch (type) {
    case "piece":
      return content ? <PieceRenderer piece={content} /> : null;

    case "wall":
      return (
        <img
          src={wallImage}
          alt="Checkpoint"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      );

    case "exit":
      return (
        <img
          src={exitImage}
          alt="Checkpoint"
          style={{
            width: "80%",
            height: "80%",
            objectFit: "contain",
          }}
        />
      );

    case "checkpoint":
      return (
        <img
          src={checkpointImage}
          alt="Checkpoint"
          style={{
            width: "80%",
            height: "80%",
            objectFit: "contain",
          }}
        />
      );

    default:
      return null;
  }
};
