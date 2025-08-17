import React from "react";
import { PieceRenderer } from "./PieceRenderer";
import starImage from "../../../assets/images/star.png";

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
        <div style={{ color: "white", fontWeight: "bold", fontSize: "20px" }}>
          {content}
        </div>
      );

    case "exit":
      return (
        <div
          style={{
            color: active ? "green" : "red",
            fontWeight: "bold",
            fontSize: "20px",
          }}
        >
          {content}
        </div>
      );

    case "checkpoint":
      return (
        <img
          src={starImage}
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
