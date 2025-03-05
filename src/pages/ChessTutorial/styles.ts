import styled from "styled-components";

export const BackButtonWrap = styled.button({
  marginBottom: "20px",
  padding: "8px 16px",
  backgroundColor: "#f0f0f0",
  border: "1px solid #ccc",
  borderRadius: "4px",
  cursor: "pointer",
});

export const ChessTutorialWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  min-height: 100vh;
`;

export const ChessTutorialTitle = styled.h1`
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
`;

export const ChessTutorialLinks = styled.div({
  display: "flex",
  gap: "2rem",
  justifyContent: "center",
  flexWrap: "wrap",
});
