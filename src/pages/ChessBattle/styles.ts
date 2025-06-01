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
