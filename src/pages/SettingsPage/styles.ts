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
  width: 900px;
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

export const SettingsLanguageButton = styled.button<{ $current: boolean }>`
  display: flex;
  flex-direction: column;
  width: 150px;
  height: 42px;
  background-color: ${({ $current }) => ($current ? "#6ecf0c" : "#96a1be")};
  color: black;
  cursor: pointer;
  border-radius: 20px;
  border: 1px solid #3e302a;
  overflow: hidden;

  &:hover {
    transform: scale(1.05);
  }
`;

export const SettingsLanguageButtonText = styled.span<{ $current: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  font-size: 18px;
  font-weight: 600;
  line-height: 22px;
  background-color: ${({ $current }) => ($current ? "#b3e644" : "#bdcce5")};
  color: #3e302a;
  border-radius: 20px;
`;
