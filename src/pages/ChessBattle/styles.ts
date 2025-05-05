import styled from "styled-components";
import backgroundHowToPlay from "src/assets/background/background_how_to_play.png";

export const PageContainer = styled.div`
  margin: 0 auto;
  background-image: url(${backgroundHowToPlay});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: calc(100vh - 96px);
  display: flex;
  flex-direction: column;
`;

export const BackButtonWrap = styled.div`
  position: absolute;
  top: 20px;
  left: 40px;
`;

export const ResetButton = styled.button`
  margin: 20px auto 8px;
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
