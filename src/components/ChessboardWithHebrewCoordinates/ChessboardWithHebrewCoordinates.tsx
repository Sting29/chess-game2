import React from "react";
import { Chessboard } from "react-chessboard";
import { ChessboardOptions } from "react-chessboard/dist/ChessboardProvider";
import styled from "styled-components";
import { ChessCoordinates } from "../ChessCoordinates/ChessCoordinates";

const ChessboardWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

interface ChessboardWithHebrewCoordinatesProps {
  options: ChessboardOptions;
}

export function ChessboardWithHebrewCoordinates({
  options,
}: ChessboardWithHebrewCoordinatesProps) {
  return (
    <ChessboardWrapper>
      <Chessboard options={options} />
      <ChessCoordinates boardOrientation={options.boardOrientation} />
    </ChessboardWrapper>
  );
}
