import styled from "styled-components";

export const SolverPage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  gap: 1rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const PuzzleDescription = styled.div`
  text-align: center;
  max-width: 600px;
  margin-bottom: 1rem;

  p {
    margin: 0.5rem 0;
    font-size: 1.1rem;
    color: white;
  }

  p:first-child {
    font-weight: bold;
    font-size: 1.2rem;
  }
`;

export const GameComplete = styled.div`
  background-color: rgba(144, 238, 144, 0.2);
  border: 2px solid #90ee90;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  margin-top: 2rem;
  max-width: 400px;

  h2 {
    color: #228b22;
    margin: 0 0 1rem 0;
    font-size: 1.5rem;
  }

  p {
    color: white;
    margin: 0 0 1.5rem 0;
  }
`;

export const PuzzleCompleteButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

export const NextPuzzleButton = styled.button`
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 140px;

  &:hover {
    background-color: #357abd;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;
