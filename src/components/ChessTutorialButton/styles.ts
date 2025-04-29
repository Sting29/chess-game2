import styled from "styled-components";

export const ChessTutorialButtonWrap = styled.button({
  position: "relative",
  border: "none",
  cursor: "pointer",
  backgroundColor: "transparent",
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },
});

export const LinkHeader = styled.h2({
  position: "absolute",
  bottom: "60px",
  left: "50%",
  transform: "translateX(-50%)",
  fontFamily: "Wendy One",
  fontSize: "38px",
  lineHeight: "40px",
  color: "#956721",
});
