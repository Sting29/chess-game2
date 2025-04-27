import styled from "styled-components";
import backgroundCheckLesson from "../../assets/background/background_check_lesson.png";
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

export const TutorialTitle = styled.h1`
  color: #333;
  margin-bottom: 0.5rem;
  text-align: center;
`;

export const TutorialDescription = styled.p`
  font-size: 1.2rem;
  color: #555;
  margin-bottom: 2rem;
  text-align: center;
`;

export const NavigationLinksContainer = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: flex-start;
  flex-wrap: wrap;
`;
