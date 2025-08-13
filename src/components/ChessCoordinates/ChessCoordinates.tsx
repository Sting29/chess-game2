import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { RootState } from "src/store";

const CoordinatesContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 568px;
  height: 568px;
  pointer-events: none;
  border: 10px solid transparent; /* Компенсация границы доски */
`;

const FileLabel = styled.div<{ index: number; orientation: "white" | "black" }>`
  position: absolute;
  bottom: 0;
  left: ${(props) => {
    const fileIndex =
      props.orientation === "white" ? props.index : 7 - props.index;
    return `${fileIndex * 68.5 + 58}px`;
  }};
  font-size: 12px;
  font-weight: bold;
  color: black;
  user-select: none;
`;

const RankLabel = styled.div<{ index: number; orientation: "white" | "black" }>`
  position: absolute;
  left: 2px;
  top: ${(props) => {
    const rankIndex =
      props.orientation === "white" ? 7 - props.index : props.index;
    return `${rankIndex * 68.5 + 8}px`;
  }};
  transform: translateY(-50%);
  font-size: 12px;
  font-weight: bold;
  color: black;
  user-select: none;
`;

interface ChessCoordinatesProps {
  boardOrientation?: "white" | "black";
}

export function ChessCoordinates({
  boardOrientation = "white",
}: ChessCoordinatesProps) {
  const language = useSelector((state: RootState) => state.settings.language);

  // Определяем буквы в зависимости от языка
  const getFiles = () => {
    switch (language) {
      case "he":
        return ["א", "ב", "ג", "ד", "ה", "ו", "ז", "ח"]; // Иврит
      default:
        return ["a", "b", "c", "d", "e", "f", "g", "h"]; // Английский по умолчанию
    }
  };

  const files = getFiles();
  const ranks = ["1", "2", "3", "4", "5", "6", "7", "8"];

  return (
    <CoordinatesContainer>
      {/* Отображение файлов */}
      {files.map((file, index) => (
        <FileLabel key={file} index={index} orientation={boardOrientation}>
          {file}
        </FileLabel>
      ))}

      {/* Отображение рангов (1-8) */}
      {ranks.map((rank, index) => (
        <RankLabel key={rank} index={index} orientation={boardOrientation}>
          {rank}
        </RankLabel>
      ))}
    </CoordinatesContainer>
  );
}
