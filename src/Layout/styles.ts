import styled from "styled-components";
import { Link } from "react-router-dom";
// import buttonExit from "../assets/elements/button_exit.png";
import buttonRed from "../assets/elements/button_red.png";
// import buttonAccount from "../assets/elements/button_account.png";
import buttonYellow from "../assets/elements/button_yellow.png";
import userIcon from "../assets/elements/user_x.png";
import buttonSettings from "../assets/elements/button_settings.png";
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
  background-color: #006acd;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
`;

export const LogoContainer = styled.div`
  position: absolute;
  left: 40px;
  top: -10px;
  display: flex;
  align-items: center;
  gap: 8px;
  overflow: hidden;
  z-index: 1;
  border-radius: 28px;
`;

export const LogoText = styled.p`
  font-family: "RubikOne", sans-serif;
  font-size: 44px;
  color: #fff7db;
  line-height: 46px;
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
  background: url(${buttonRed}) no-repeat center center;
  background-size: contain;
  transition: transform 0.2s;
  cursor: pointer;

  padding-bottom: 4px;
  font-family: "RubikOne", sans-serif;
  font-size: 32px;
  line-height: 100%px;
  color: #fff7db;
  text-align: center;
  -webkit-text-stroke: 1px black;

  &:hover {
    transform: scale(1.05);
  }
`;

export const SettingsButton = styled(Link)`
  width: 72px;
  height: 56px;
  margin-right: 84px;
  border: none;
  background: url(${buttonSettings}) no-repeat center center;
  background-size: contain;
  transition: transform 0.2s;
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
  }
`;

export const AccountButton = styled(Link)`
  display: block;
  position: relative;
  height: 56px;
  width: 200px;
  margin-right: 28px;
  border: none;
  background: url(${buttonYellow}) no-repeat center center;
  background-size: contain;
  transition: transform 0.2s;
  text-decoration: none;

  padding-top: 4px;
  font-family: "RubikOne", sans-serif;
  font-size: 32px;
  line-height: 100%px;
  color: #fff7db;
  text-align: center;
  -webkit-text-stroke: 1px black;

  &::before {
    content: "";
    position: absolute;
    left: -56px;
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

export const RedButton = styled.button`
  width: 206px;
  height: 57px;
  border-radius: 21px;
  border: 3px solid #3e302a;
  position: relative;
  background: linear-gradient(
    to bottom,
    #ffca0f 0%,
    #ffca0f 90%,
    #ff9f0f 90%,
    #ff9f0f 100%
  );

  &::after {
    content: "";
    position: absolute;
    top: 8px;
    right: 16px;
    width: 25px;
    height: 14px;
    background: #fff174;
    border-radius: 50%;
    transform: rotate(-15deg);
    opacity: 0.8;
  }
`;
