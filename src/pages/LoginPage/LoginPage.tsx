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
  LoginButton,
} from "./styles";

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
      <LoginBox>
        <LoginHeader>
          <p>Enter your account</p>
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
              disabled
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
              disabled
            />
          </FormGroup>

          <LoginButton type="submit">Login</LoginButton>
        </LoginForm>
      </LoginBox>
    </LoginContainer>
  );
}
