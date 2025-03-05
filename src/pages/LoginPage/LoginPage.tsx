import React from "react";
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
  LoginFooter,
  Link,
} from "./styles";

export function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Простая имитация входа
    localStorage.setItem("isAuthenticated", "true");
    navigate("/");
  };

  return (
    <LoginContainer>
      <LoginBox>
        <LoginHeader>
          <h2>Шахматный тренажер</h2>
          <p>Войдите в свой аккаунт</p>
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
            <SrOnly htmlFor="password">Пароль</SrOnly>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="Пароль"
              disabled
            />
          </FormGroup>

          <LoginButton type="submit">Войти</LoginButton>
        </LoginForm>

        <LoginFooter>
          <Link href="#">Забыли пароль?</Link>
          <Link href="#">Зарегистрироваться</Link>
        </LoginFooter>
      </LoginBox>
    </LoginContainer>
  );
}
