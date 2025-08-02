import styled from "styled-components";
import { Link } from "react-router-dom";
import backgroundPuzzlesSelect from "src/assets/background/background_puzzles_select.png";
import BoardPuzzle from "src/assets/images/board_puzzle.png";

export const TutorialPage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: calc(100vh - 96px);
  padding: 0 40px;
  background-image: url(${backgroundPuzzlesSelect});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
`;

export const PuzzleCategories = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 24px;
`;

export const PuzzleCategory = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 20px;
`;

export const PuzzleCount = styled.p`
  min-width: 124px;
  max-width: 124px;
  height: 42px;
  background-color: #6ecf0c;
  border-radius: 8px;
  border: 1px solid #3e302a;
`;

export const PuzzleListWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-top: 24px;
`;

export const PuzzleItem = styled(Link)`
  background: #f7f7f7;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.07);
  padding: 18px 16px 12px 16px;
  cursor: pointer;
  transition: box-shadow 0.2s, transform 0.2s;
  text-decoration: none;

  &:hover {
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.13);
    transform: translateY(-1px) scale(1.02);
  }
  h3 {
    margin: 0 0 6px 0;
    font-size: 1.1rem;
  }
  p {
    margin: 0;
    color: #666;
    font-size: 0.98rem;
  }
`;

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
