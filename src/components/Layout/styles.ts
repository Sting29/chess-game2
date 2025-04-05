import styled from "styled-components";
import chessboardBackground from "../../assets/background/chessboard_background.jpg";
// Временно закомментируем импорт логотипа, пока не будет добавлен файл
// import logo from "../../assets/background/chess_club_logo.jpg";

export const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

export const Header = styled.div`
  height: 96px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background-color: #4188c9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
`;

export const LogoContainer = styled.div`
  position: absolute;
  left: 40px;
  top: 8px;
  overflow: hidden;
  z-index: 1;
  border-radius: 28px;
`;

export const Logo = styled.img`
  height: 40px;
  width: auto;
  border-radius: 4px;
`;

export const MainContent = styled.main`
  flex: 1;
  position: relative;
`;

export const LogoutButton = styled.button`
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #c82333;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.25);
  }
`;

export const BackgroundImage = styled.div`
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
