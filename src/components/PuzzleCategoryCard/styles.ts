import styled from "styled-components";
import BoardPuzzle from "src/assets/images/board_puzzle.png";

export const PuzzleBoardButton = styled.button`
  display: flex;
  gap: 16px;
  width: 612px;
  height: 169px;
  padding: 24px 48px 16px 48px;
  background-image: url(${BoardPuzzle});
  background-size: cover;
  background-color: transparent;
  border: none;
`;

export const PuzzleCategory = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 20px;
`;

export const PuzzleCategoryTitle = styled.h2`
  text-align: start;
  color: #f0ed9c;
  font-size: 34px;
  font-weight: 800;
  line-height: 38px;
`;

export const PuzzleCategoryDescriptionWrap = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
`;

export const PuzzleCategoryDescription = styled.p`
  font-size: 18px;
  font-weight: 600;
  line-height: 20px;
  color: #dbbd53;
  text-align: start;
`;

export const PuzzleCount = styled.p`
  min-width: 124px;
  max-width: 124px;
  height: 42px;
  background-color: #6ecf0c;
  border-radius: 8px;
  border: 1px solid #3e302a;
`;

export const PuzzleCountText = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  font-size: 18px;
  font-weight: 600;
  line-height: 22px;
  background-color: #b3e644;
  color: #3e302a;
  border-radius: 8px;
`;
