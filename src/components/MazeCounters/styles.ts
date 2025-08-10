import styled from "styled-components";

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
  font-size: 0.9rem;

  &.checkpoints {
    color: #4a90e2;
    border: 2px solid #4a90e2;
  }

  &.moves {
    color: #f5a623;
    border: 2px solid #f5a623;
  }

  &.time {
    color: #d0021b;
    border: 2px solid #d0021b;
  }

  &.time.warning {
    animation: pulse 1s infinite;
  }

  @keyframes pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
  }
`;
