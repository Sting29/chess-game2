import styled from "styled-components";
import { Link } from "react-router-dom";
import chessboardBackground from "../assets/background/chessboard_background.jpg";
import buttonExit from "../assets/elements/button_exit.png";
import buttonAccount from "../assets/elements/button_account.png";
import userIcon from "../assets/elements/user_x.png";

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
  width: 148px;
  height: 56px;
  margin-right: 40px;
  border: none;
  background: url(${buttonExit}) no-repeat center center;
  background-size: contain;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
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

export const AccountButton = styled(Link)`
  display: block;
  position: relative;
  height: 56px;
  width: 200px;
  margin-right: 28px;
  border: none;
  background: url(${buttonAccount}) no-repeat center center;
  background-size: contain;
  transition: transform 0.2s;
  text-decoration: none;

  &::before {
    content: "";
    position: absolute;
    left: -40px;
    top: 50%;
    transform: translateY(-50%);
    width: 80px;
    height: 80px;
    background: url(${userIcon}) no-repeat center;
    background-size: contain;
  }

  &:hover {
    transform: scale(1.05);
  }
`;
