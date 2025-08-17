import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import { CoordinatesContainer, FileLabel, RankLabel } from "./styles";

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
        <FileLabel key={file} $index={index} $orientation={boardOrientation}>
          {file}
        </FileLabel>
      ))}

      {/* Отображение рангов (1-8) */}
      {ranks.map((rank, index) => (
        <RankLabel key={rank} $index={index} $orientation={boardOrientation}>
          {rank}
        </RankLabel>
      ))}
    </CoordinatesContainer>
  );
}
