import styled from "styled-components";

export const ChessTutorialButtonWrap = styled.button({
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
