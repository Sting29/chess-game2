import React from "react";
import {
  LayoutContainer,
  Header,
  MainContent,
  LogoutButton,
  AccountButton,
  LogoContainer,
  LogoText,
} from "./styles";

import LogoImg from "src/assets/logo/logo.png";
import Image from "../components/Image/Image";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    // Принудительно обновляем страницу и перенаправляем на логин
    window.location.href = "/login";
  };

  return (
    <LayoutContainer>
      <LogoContainer>
        <Image src={LogoImg} height={124} />
        <LogoText>Chess for Everyone</LogoText>
      </LogoContainer>
      <Header>
        <AccountButton to="/account" aria-label="Account settings" />
        <LogoutButton onClick={handleLogout} aria-label="Exit" />
      </Header>
      <MainContent>{children}</MainContent>
    </LayoutContainer>
  );
}
