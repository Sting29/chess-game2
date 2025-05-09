import styled from "styled-components";
import backgroundCheckLesson from "../../assets/background/background_how_to_move.png";

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: calc(100vh - 96px);
  padding: 0 40px;
  background-image: url(${backgroundCheckLesson});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
`;

export const SettingsContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 20px;
  width: 800px;
  margin-top: 20px;
`;

export const SettingsTitle = styled.h2`
  width: 200px;
  font-size: 24px;
  font-weight: 600;
`;

export const SettingsLanguage = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

export const SettingsLanguageButton = styled.button<{ current: boolean }>`
  width: 150px;
  height: 40px;
  border-radius: 12px;
  border: 1px solid black;
  background-color: ${({ current }) => (current ? "green" : "white")};
  font-size: 16px;
  font-weight: 600;
  color: black;
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
  }
`;
