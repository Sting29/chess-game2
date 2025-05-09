import React, { useCallback } from "react";
import {
  LayoutContainer,
  Header,
  MainContent,
  LogoutButton,
  AccountButton,
  LogoContainer,
  LogoText,
  SettingsButton,
} from "./styles";
import { useBreakpoint } from "src/hooks/useBreakpoint";

import LogoImg from "src/assets/logo/logo.png";
import Image from "../components/Image/Image";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { breakpoint } = useBreakpoint();

  // Мемоизированный обработчик выхода
  const handleLogout = useCallback(() => {
    localStorage.removeItem("isAuthenticated");
    // Принудительно обновляем страницу и перенаправляем на логин
    window.location.href = "/login";
  }, []);

  return (
    <LayoutContainer>
      <LogoContainer>
        <Image src={LogoImg} height={124} />
        {/* Показываем текст только на больших экранах */}
        {breakpoint !== "mobile" && breakpoint !== "tablet" && (
          <LogoText>Chess for Everyone</LogoText>
        )}
      </LogoContainer>
      <Header>
        <SettingsButton to="/settings" aria-label="Settings" />
        <AccountButton to="/account" aria-label="Account settings" />
        <LogoutButton onClick={handleLogout} aria-label="Exit" />
      </Header>
      <MainContent>{children}</MainContent>
    </LayoutContainer>
  );
}
