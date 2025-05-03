import styled from "styled-components";
import backgroundHowToMove from "src/assets/background/background_game_how_to_play.png";

export const PageContainer = styled.div`
  margin: 0 auto;
  background-image: url(${backgroundHowToMove});
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

export const Title = styled.h1`
  color: #333;
  margin: 40px 0 20px;
  text-align: center;
  font-family: "Wendy One", sans-serif;
  font-size: 70px;
  line-height: 74px;
  color: #fff7db;
`;

export const SideContent = styled.div`
  position: absolute;
  top: 120px;
  right: 0;
  width: 300px;
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

export const BackButtonWrap = styled.div`
  position: absolute;
  top: 20px;
  left: 40px;
`;

export const QuestionButtonWrap = styled.div`
  position: absolute;
  top: 20px;
  right: 40px;
`;
