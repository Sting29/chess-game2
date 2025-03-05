import React from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutContainer,
  Header,
  MainContent,
  LogoutButton,
  LogoContainer,
  Title,
} from "./styles";
// Временно закомментируем импорт логотипа, пока не будет добавлен файл
import LogoImg from "src/assets/logo/chess_club_logo.jpg";
import Image from "../Image/Image";

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
        <LogoContainer>
          <Image src={LogoImg} height={32} />
          <Title>Школа шахмат</Title>
        </LogoContainer>
        <LogoutButton onClick={handleLogout}>Выйти</LogoutButton>
      </Header>
      <MainContent>{children}</MainContent>
    </LayoutContainer>
  );
}
