import styled from "styled-components";
import backgroundCheckLesson from "../../assets/background/background_play_with.png";
export const TutorialPageContainer = styled.div`
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

export const TutorialDescription = styled.p`
  color: #555;
  margin-bottom: 20px;
  text-align: center;
  font-size: 38px;
  font-weight: 800;
  line-height: 46px;
  color: #fff7db;
`;

export const NavigationLinksContainer = styled.div`
  margin-top: 40px;
  display: flex;
  gap: 2rem;
  justify-content: flex-start;
  flex-wrap: wrap;
`;
