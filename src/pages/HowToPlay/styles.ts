import styled from "styled-components";

export const TutorialPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
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
