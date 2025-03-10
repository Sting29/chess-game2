import styled from "styled-components";

export const PageContainer = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
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
  margin-bottom: 2rem;
  text-align: center;
`;

export const SideContent = styled.div`
  width: 300px;
  flex-shrink: 0;
  margin-top: 10rem;
`;

export const BoardContainer = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
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
