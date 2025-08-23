import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  ErrorMessage,
  // Title,
} from "./styles";
import LoadingOverlay from "src/components/LoadingOverlay/LoadingOverlay";

import LogoImg from "src/assets/logo/logo_big.png";
import LogoImgHe from "src/assets/logo/logo_he.png";
import LogoTitle from "src/assets/elements/enter_your_account.png";
import Cat from "src/assets/images/cat.png";
import Boy from "src/assets/images/boy.png";
import Image from "src/components/Image/Image";
// import { useIsMobile } from "src/hooks/useIsMobile";
import { useBreakpoint } from "src/hooks/useBreakpoint";
import { useTranslation } from "react-i18next";
import { RootState, AppDispatch } from "src/store";
import { loginUser } from "src/store/settingsSlice";

export function LoginPage() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { breakpoint } = useBreakpoint();

  // Local form state
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  // Redux state
  const { loading, error } = useSelector((state: RootState) => state.settings);

  // Note: Navigation is now handled by RootRoute component
  // No need for useEffect navigation since RootRoute conditionally renders
  // LoginPage or ChessTutorial based on authentication state

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username.trim() || !formData.password.trim()) {
      return;
    }

    try {
      const result = await dispatch(
        loginUser({
          username: formData.username.trim(),
          password: formData.password,
        })
      );

      if (loginUser.fulfilled.match(result)) {
        // Login successful - RootRoute will automatically render ChessTutorial
        // console.log("Login successful");
      }
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

        <LoadingOverlay isVisible={loading} message={t("logging_in")}>
          <LoginForm onSubmit={handleLogin} aria-label={t("login_and_play")}>
            {error && <ErrorMessage>{t(error) || error}</ErrorMessage>}

            <FormGroup>
              <SrOnly htmlFor="username">{t("username")}</SrOnly>
              <Input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                placeholder={t("username")}
                value={formData.username}
                onChange={handleInputChange}
                disabled={loading}
              />
            </FormGroup>

            <FormGroup>
              <SrOnly htmlFor="password">{t("password")}</SrOnly>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder={t("password")}
                value={formData.password}
                onChange={handleInputChange}
                disabled={loading}
              />
            </FormGroup>

            <PlayButton
              type="submit"
              aria-label={t("login_and_play")}
              disabled={
                loading ||
                !formData.username.trim() ||
                !formData.password.trim()
              }
            />
          </LoginForm>
        </LoadingOverlay>
      </LoginBox>
    </LoginContainer>
  );
}
