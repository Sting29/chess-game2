import styled from "styled-components";

export const MazeControlsContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

export const HintToggleButton = styled.button<{ $active: boolean }>`
  padding: 0.75rem 1.5rem;
  border: 2px solid #4a90e2;
  border-radius: 8px;
  background-color: ${({ $active }) => ($active ? "#4A90E2" : "transparent")};
  color: ${({ $active }) => ($active ? "white" : "#4A90E2")};
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;

  &:hover {
    background-color: #4a90e2;
    color: white;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const RestartButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: 2px solid #f5a623;
  border-radius: 8px;
  background-color: transparent;
  color: #f5a623;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;

  &:hover {
    background-color: #f5a623;
    color: white;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;
