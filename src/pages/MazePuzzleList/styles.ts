import styled from "styled-components";

export const MazeListPage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  gap: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
    gap: 1rem;
  }
`;

export const ProgressSection = styled.div`
  width: 100%;
  max-width: 600px;
  text-align: center;
`;

export const ProgressText = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: white;
`;

export const ProgressBar = styled.div`
  width: 100%;
  height: 20px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.3);
`;

export const MazePuzzleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  width: 100%;
  max-width: 1200px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

export const MazePuzzleItem = styled.div<{ completed: boolean }>`
  background-color: ${({ completed }) =>
    completed ? "rgba(144, 238, 144, 0.2)" : "rgba(255, 255, 255, 0.1)"};
  border: 2px solid
    ${({ completed }) => (completed ? "#90EE90" : "rgba(255, 255, 255, 0.3)")};
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
    border-color: ${({ completed }) => (completed ? "#90EE90" : "#4A90E2")};
  }

  &:active {
    transform: translateY(-2px);
  }
`;

export const PuzzleTitle = styled.h3`
  margin: 0 0 1rem 0;
  font-size: 1.3rem;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const PuzzleStatus = styled.span<{ completed: boolean }>`
  font-size: 1.5rem;
  color: ${({ completed }) => (completed ? "#228B22" : "transparent")};
  font-weight: bold;
`;

export const PuzzleDescription = styled.p`
  margin: 0 0 1rem 0;
  color: white;
  opacity: 0.8;
  line-height: 1.4;
`;

export const PuzzleConstraints = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  font-size: 0.9rem;

  span {
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-weight: bold;

    &.moves {
      background-color: rgba(245, 166, 35, 0.2);
      color: #f5a623;
      border: 1px solid #f5a623;
    }

    &.time {
      background-color: rgba(208, 2, 27, 0.2);
      color: #d0021b;
      border: 1px solid #d0021b;
    }

    &.no-limits {
      background-color: rgba(74, 144, 226, 0.2);
      color: #4a90e2;
      border: 1px solid #4a90e2;
    }
  }
`;
