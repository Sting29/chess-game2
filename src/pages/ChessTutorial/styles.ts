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
  border: "none",
  borderRadius: "8px",
  backgroundColor: "green",
  color: "white",
  cursor: "pointer",
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },
});

export const LinkHeader = styled.h2({
  fontSize: "1.2rem",
  fontWeight: "bold",
});
