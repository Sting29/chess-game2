import styled from "styled-components";

export const PageContainer = styled.div`
  min-height: 100vh;
  padding: 2rem;
`;

export const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 2rem;
`;

export const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;

  h1 {
    color: #333;
    margin-bottom: 1rem;
  }
`;

export const GameCompleteMessage = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin: 1rem 0;
`;

export const ResetButton = styled.button`
  background-color: #4a90e2;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #357abd;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.4);
  }
`;
