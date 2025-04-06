import React from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutContainer,
  Header,
  MainContent,
  LogoutButton,
  AccountButton,
  LogoContainer,
} from "./styles";
// Временно закомментируем импорт логотипа, пока не будет добавлен файл
import LogoImg from "src/assets/logo/logo.png";
import Image from "../Image/Image";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    // Принудительно обновляем страницу и перенаправляем на логин
    window.location.href = "/login";
  };

  const handleAccountClick = () => {
    navigate("/account");
  };

  return (
    <LayoutContainer>
      <LogoContainer>
        <Image src={LogoImg} height={148} />
      </LogoContainer>
      <Header>
        <AccountButton
          onClick={handleAccountClick}
          aria-label="Account settings"
        />
        <LogoutButton onClick={handleLogout} aria-label="Exit" />
      </Header>
      <MainContent>{children}</MainContent>
    </LayoutContainer>
  );
}
