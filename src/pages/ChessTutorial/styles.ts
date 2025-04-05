import styled, { keyframes } from "styled-components";
import chessboardBackground from "../../assets/background/backgroundIslands.png";

export const BackButtonWrap = styled.button({
  marginBottom: "20px",
  padding: "8px 16px",
  backgroundColor: "#f0f0f0",
  border: "1px solid #ccc",
  borderRadius: "4px",
  cursor: "pointer",
});

export const ChessTutorialWrap = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(
      rgba(245, 245, 245, 0.2),
      rgba(245, 245, 245, 0.2)
    ),
    url(${chessboardBackground});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
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

export const PalmLeaves = styled.div<{ $isMobile: boolean }>`
  position: absolute;
  top: 0;
  right: 0;
  width: ${(props) => (props.$isMobile ? "20%" : "15%")};
  height: ${(props) => (props.$isMobile ? "25%" : "30%")};
  z-index: 3;
  overflow: hidden;

  img {
    width: 100%;
    height: auto;
  }
`;

const cloudAnimation = keyframes`
  0% {
    transform: translateX(-3%);
  }
  100% {
    transform: translateX(0);
  }
`;

export const Clouds = styled.div<{ $isMobile: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: ${(props) => (props.$isMobile ? "60%" : "75%")};
  height: ${(props) => (props.$isMobile ? "30%" : "40%")};
  z-index: 3;
  overflow: hidden;

  img {
    width: 100%;
    height: auto;
    animation: ${cloudAnimation} 20s ease-in-out infinite alternate;
  }
`;
