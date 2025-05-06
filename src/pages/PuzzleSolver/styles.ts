import styled from "styled-components";
import backgroundPuzzles from "src/assets/background/background_puzzles.png";

export const SolverPage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: calc(100vh - 96px);
  padding: 0 40px;
  background-image: url(${backgroundPuzzles});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
`;

export const PuzzleDescription = styled.div`
  margin: 18px 0 24px 0;
  max-width: 600px;
  text-align: center;
  p {
    margin: 0;
    color: #444;
    font-size: 1.08rem;
  }
`;

export const PuzzleControls = styled.div`
  display: flex;
  gap: 16px;
  margin: 24px 0 0 0;
`;

export const HintButton = styled.button`
  padding: 0.6rem 1.2rem;
  background: #e0e7ef;
  color: #333;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
  &:hover {
    background: #c9d6e3;
  }
`;

export const ResetButton = styled.button`
  padding: 0.6rem 1.2rem;
  background: #f7dada;
  color: #a33;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
  &:hover {
    background: #f2bcbc;
  }
`;

export const HintContainer = styled.div`
  margin: 18px 0 0 0;
  max-width: 600px;
  background: #fffbe6;
  border-left: 4px solid #ffe066;
  border-radius: 6px;
  padding: 14px 18px;
`;

export const HintText = styled.p`
  margin: 0;
  color: #b59a00;
  font-size: 1.05rem;
`;

export const GameComplete = styled.div`
  margin: 32px 0 0 0;
  text-align: center;
`;

export const PuzzleCompleteButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 18px;
  margin-top: 18px;
`;

export const NextPuzzleButton = styled.button`
  padding: 0.7rem 1.5rem;
  background: #b6e3b6;
  color: #1a4d1a;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 1.05rem;
  transition: background 0.2s;
  &:hover {
    background: #8fd88f;
  }
`;
