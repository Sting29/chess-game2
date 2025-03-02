import styled from "styled-components";

export const BackButtonWrap = styled.button({
  marginBottom: "20px",
  padding: "8px 16px",
  backgroundColor: "#f0f0f0",
  border: "1px solid #ccc",
  borderRadius: "4px",
  cursor: "pointer",
});

export const ChessTutorialWrap = styled.div({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "2rem",
  minHeight: "100vh",
  backgroundColor: "#f5f5f5",
});

export const ChessTutorialTitle = styled.h1({
  color: "#333",
  marginBottom: "2rem",
  textAlign: "center",
});

export const ChessTutorialLinks = styled.div({
  display: "flex",
  gap: "2rem",
  justifyContent: "center",
  flexWrap: "wrap",
});

export const ChessTutorialButton = styled.button({
  padding: "1rem 2rem",
  fontSize: "1.2rem",
  border: "none",
  borderRadius: "8px",
  backgroundColor: "#4caf50",
  color: "white",
  cursor: "pointer",
  transition: "background-color 0.3s",
});
