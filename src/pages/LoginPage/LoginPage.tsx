import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LoginContainer,
  LoginBox,
  LoginHeader,
  LoginForm,
  FormGroup,
  SrOnly,
  Input,
  PlayButton,
  BlueLine,
  LogoContainer,
  CatContainer,
  BoyContainer,
  // Title,
} from "./styles";

import LogoImg from "src/assets/logo/logo_big.png";
import LogoImgHe from "src/assets/logo/logo_he.png";
import LogoTitle from "src/assets/elements/enter_your_account.png";
import Cat from "src/assets/images/cat.png";
import Boy from "src/assets/images/boy.png";
import Image from "src/components/Image/Image";
// import { useIsMobile } from "src/hooks/useIsMobile";
import { useBreakpoint } from "src/hooks/useBreakpoint";
import { useTranslation } from "react-i18next";

export function LoginPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { breakpoint } = useBreakpoint();

  useEffect(() => {
    // Если пользователь уже авторизован, перенаправляем на главную
    if (localStorage.getItem("isAuthenticated") === "true") {
      navigate("/");
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Устанавливаем флаг аутентификации
      localStorage.setItem("isAuthenticated", "true");
      // Принудительно обновляем страницу для применения изменений
      window.location.href = "/";
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <LoginContainer>
      <BlueLine />
      <LogoContainer>
        <Image
          src={i18n.language === "he" ? LogoImgHe : LogoImg}
          height={310}
        />
      </LogoContainer>
      <LoginBox>
        <LoginHeader>
          <Image src={LogoTitle} height={42} width={366} />
          {/* <Title>Enter your account</Title> */}
        </LoginHeader>

        <CatContainer $isMobile={breakpoint === "mobile"}>
          <Image src={Cat} height={256} />
        </CatContainer>
        <BoyContainer
          $isMobile={breakpoint === "mobile" || breakpoint === "tablet"}
        >
          <Image src={Boy} height={385} />
        </BoyContainer>

        <LoginForm onSubmit={handleLogin} aria-label={t("login_and_play")}>
          <FormGroup>
            <SrOnly htmlFor="login">Login</SrOnly>
            <Input
              id="login"
              name="login"
              type="text"
              autoComplete="login"
              required
              placeholder="Login"
              disabled={true}
            />
          </FormGroup>

          <FormGroup>
            <SrOnly htmlFor="password">Password</SrOnly>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="Password"
              disabled={true}
            />
          </FormGroup>
          <PlayButton type="submit" aria-label={t("login_and_play")} />
        </LoginForm>
      </LoginBox>
    </LoginContainer>
  );
}
