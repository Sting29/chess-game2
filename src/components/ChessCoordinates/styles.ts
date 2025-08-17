import styled from "styled-components";

export const CoordinatesContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 568px;
  height: 568px;
  pointer-events: none;
  border: 10px solid transparent; /* Компенсация границы доски */
`;

export const FileLabel = styled.div<{
  $index: number;
  $orientation: "white" | "black";
}>`
  position: absolute;
  bottom: 2px;
  left: ${(props) => {
    const fileIndex =
      props.$orientation === "white" ? props.$index : 7 - props.$index;
    return `${fileIndex * 68 + 58}px`;
  }};
  font-size: 12px;
  font-weight: bold;
  color: black;
  user-select: none;
`;

export const RankLabel = styled.div<{
  $index: number;
  $orientation: "white" | "black";
}>`
  position: absolute;
  left: 2px;
  top: ${(props) => {
    const rankIndex =
      props.$orientation === "white" ? 7 - props.$index : props.$index;
    return `${rankIndex * 68 + 8}px`;
  }};
  transform: translateY(-50%);
  font-size: 12px;
  font-weight: bold;
  color: black;
  user-select: none;
`;
