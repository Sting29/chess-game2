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

// Стили для модального окна настроек
export const SettingsModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const SettingsContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 20px;
  min-width: 400px;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
`;

export const SettingsTitle = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

// Стили для информации об уровне
export const LevelInfo = styled.div`
  margin-bottom: 25px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 10px;
  text-align: center;
`;

export const LevelTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
`;

export const LevelDescription = styled.div`
  font-size: 14px;
  color: #666;
`;

// Стили для элементов настроек
export const SettingItem = styled.div`
  margin-bottom: 20px;
`;

export const SettingLabel = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
`;

export const SettingDescription = styled.div`
  font-size: 12px;
  color: #666;
  margin-bottom: 10px;
`;

export const SettingSlider = styled.input`
  width: 100%;
`;

// Стили для информационного блока детских режимов
export const KidsInfoBlock = styled.div`
  padding: 15px;
  background: #fff3e0;
  border-radius: 10px;
  margin-bottom: 20px;
`;

export const KidsInfoText = styled.div`
  font-size: 14px;
  color: #e65100;
  text-align: center;
`;

// Стили для блока текущих настроек
export const CurrentSettingsBlock = styled.div`
  padding: 15px;
  background: #f8f9fa;
  border-radius: 10px;
  margin-bottom: 20px;
  font-size: 12px;
`;

export const CurrentSettingsTitle = styled.h4`
  margin: 0 0 10px 0;
`;

// Стили для контейнера кнопок
export const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 25px;
`;

export const CloseButton = styled.button`
  padding: 10px 20px;
  border-radius: 20px;
  border: none;
  background: #4caf50;
  color: white;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background: #45a049;
  }
`;
