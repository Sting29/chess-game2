import styled from "styled-components";
import backgroundPlayWith from "src/assets/background/background_play_with.png";

export const PageContainer = styled.div`
  margin: 0 auto;
  background-image: url(${backgroundPlayWith});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: calc(100vh - 96px);
`;

export const ContentContainer = styled.div`
  display: flex;
  gap: 2rem;
  align-items: flex-start;
`;

export const MainContent = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const GameCompleteMessage = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin: 1rem 0;
`;

export const ResetButton = styled.button`
  margin-top: 1rem;
  padding: 0.8rem 1.5rem;
  background-color: #4a4a4a;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #333;
  }
`;

export const BoomAnimation = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 3rem;
  color: red;
  font-weight: bold;
  animation: boom 0.5s ease-out;

  @keyframes boom {
    0% {
      transform: translate(-50%, -50%) scale(0);
      opacity: 1;
    }
    100% {
      transform: translate(-50%, -50%) scale(2);
      opacity: 0;
    }
  }
`;

// Стили для игровых элементов управления
export const GameControls = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
`;

export const SettingsButton = styled.button<{ kidsMode?: boolean }>`
  padding: 10px 20px;
  border-radius: 25px;
  border: none;
  background: ${(props) => (props.kidsMode ? "#FF6B6B" : "#4CAF50")};
  color: white;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;

  &:hover {
    opacity: 0.9;
  }
`;

export const QuestionButtonWrap = styled.div`
  position: absolute;
  top: 20px;
  right: 40px;
`;

export const SideContent = styled.div`
  position: absolute;
  top: 120px;
  right: 0;
`;

export const ChessBoardWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin: 2rem 0;

  @media (max-width: 768px) {
    gap: 1.5rem;
    margin: 1.5rem 0;
  }

  @media (max-width: 480px) {
    gap: 1rem;
    margin: 1rem 0;
  }
`;
