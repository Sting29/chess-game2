import React from "react";
import { useNavigate } from "react-router-dom";
import { LayoutContainer, Header, MainContent, LogoutButton } from "./styles";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  return (
    <LayoutContainer>
      <Header>
        <LogoutButton onClick={handleLogout}>Выйти</LogoutButton>
      </Header>
      <MainContent>{children}</MainContent>
    </LayoutContainer>
  );
}
