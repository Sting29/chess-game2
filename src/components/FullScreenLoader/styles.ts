import styled from "styled-components";
import backgroundErrorScreen from "src/assets/background/background_error_screen.png";

export const FullScreenContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  background-image: url(${backgroundErrorScreen});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
`;

export const LoadingMessage = styled.div`
  margin-top: 16px;
  color: white;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
`;
