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
} from "./styles";

import LogoImg from "src/assets/logo/logo_big.png";
import LogoTitle from "src/assets/elements/enter_your_account.png";
import Cat from "src/assets/images/cat.png";
import Boy from "src/assets/images/boy.png";
import Image from "src/components/Image/Image";

export function LoginPage() {
  const navigate = useNavigate();

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
        <Image src={LogoImg} height={310} />
      </LogoContainer>
      <LoginBox>
        <LoginHeader>
          <Image src={LogoTitle} height={42} width={366} />
        </LoginHeader>

        <LoginForm onSubmit={handleLogin}>
          <FormGroup>
            <SrOnly htmlFor="email-address">Email</SrOnly>
            <Input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Email"
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

          <PlayButton type="submit" aria-label="Login and Play" />
        </LoginForm>
      </LoginBox>
      <CatContainer>
        <Image src={Cat} height={256} />
      </CatContainer>
      <BoyContainer>
        <Image src={Boy} height={385} />
      </BoyContainer>
    </LoginContainer>
  );
}
