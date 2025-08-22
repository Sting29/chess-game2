import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  LayoutContainer,
  Header,
  MainContent,
  LogoutButton,
  LogoContainer,
  LogoText,
  SettingsButton,
  // RedButton,
} from "./styles";
import { useBreakpoint } from "src/hooks/useBreakpoint";
import { useTranslation } from "react-i18next";
import { AppDispatch } from "src/store";
import { logoutUser, clearAuthState } from "src/store/settingsSlice";

import LogoImg from "src/assets/logo/logo_en_new.png";
import LogoImgHe from "src/assets/logo/logo_he_new.png";
import Image from "../components/Image/Image";
import { t } from "i18next";
import { Link } from "react-router-dom";
import AccountButton from "src/components/AccountButton/AccountButton";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { breakpoint } = useBreakpoint();
  const { i18n } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Redux logout handler
  const handleLogout = useCallback(async () => {
    try {
      // Call Redux action for logout
      await dispatch(logoutUser()).unwrap();
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if API call failed, clear local state
      dispatch(clearAuthState());
    } finally {
      // Always navigate to root route which will show LoginPage
      navigate("/", { replace: true });
    }
  }, [dispatch, navigate]);

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
        <AccountButton />
        <LogoutButton onClick={handleLogout}>{t("layout_exit")}</LogoutButton>
        {/* <RedButton /> */}
      </Header>
      <MainContent>{children}</MainContent>
    </LayoutContainer>
  );
}
