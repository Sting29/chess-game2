import styled from "styled-components";

export const MazeBoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

export const MazeStatus = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  text-align: center;
  padding: 0.5rem;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
`;

export const MazeCountersContainer = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
  }
`;

export const MazeCounter = styled.div`
  background-color: rgba(255, 255, 255, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: bold;
  text-align: center;
  min-width: 120px;

  &.checkpoints {
    color: #4a90e2;
  }

  &.moves {
    color: #f5a623;
  }

  &.time {
    color: #d0021b;
  }
`;
