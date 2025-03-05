import styled from "styled-components";
import chessboardBackground from "../../assets/background/chessboard_background.jpg";
// Временно закомментируем импорт логотипа, пока не будет добавлен файл
// import logo from "../../assets/background/chess_club_logo.jpg";

export const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
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

export const Header = styled.div`
  background-color: rgba(255, 255, 255, 0.9);
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  backdrop-filter: blur(5px);
`;

export const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const Logo = styled.img`
  height: 40px;
  width: auto;
  border-radius: 4px;
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  color: #333;
  font-weight: 600;
`;

export const MainContent = styled.main`
  margin-top: 60px;
  flex: 1;
  padding: 20px;
  position: relative;
  z-index: 1;
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
