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
  // RedButton,
} from "./styles";
import { useBreakpoint } from "src/hooks/useBreakpoint";
import { useTranslation } from "react-i18next";

import LogoImg from "src/assets/logo/logo_en_new.png";
import LogoImgHe from "src/assets/logo/logo_he_new.png";
import Image from "../components/Image/Image";
import { t } from "i18next";
import { Link } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { breakpoint } = useBreakpoint();
  const { i18n } = useTranslation();

  // Мемоизированный обработчик выхода
  const handleLogout = useCallback(() => {
    localStorage.removeItem("isAuthenticated");
    // Принудительно обновляем страницу и перенаправляем на логин
    window.location.href = "/login";
  }, []);

  return (
    <LayoutContainer>
      <LogoContainer>
        <Link to="/">
          <Image
            src={i18n.language === "he" ? LogoImgHe : LogoImg}
            height={124}
            style={{ padding: "8px 0" }}
          />
        </Link>

        {/* Показываем текст только на больших экранах */}
        {breakpoint !== "mobile" && breakpoint !== "tablet" && (
          <LogoText>{t("layout_logo_text")}</LogoText>
        )}
      </LogoContainer>
      <Header>
        <SettingsButton
          to="/settings"
          aria-label={t("layout_settings_button")}
          $isHebrew={i18n.language === "he"}
        />
        <AccountButton to="/account" $isHebrew={i18n.language === "he"}>
          {t("layout_account_settings")}
        </AccountButton>
        <LogoutButton onClick={handleLogout}>{t("layout_exit")}</LogoutButton>
        {/* <RedButton /> */}
      </Header>
      <MainContent>{children}</MainContent>
    </LayoutContainer>
  );
}
