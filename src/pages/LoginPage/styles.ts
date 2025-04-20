import styled from "styled-components";
import chessboardBackground from "../../assets/background/background_login_test.png";

export const LoginContainer = styled.div`
  min-height: 100vh;
  display: block;
  background-image: url(${chessboardBackground});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

export const LoginBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 400px;
  max-width: 400px;
  margin: 0 auto;
`;

export const LoginHeader = styled.div`
  margin: 0.5rem 0 1.5rem;
`;

export const LoginForm = styled.form`
  width: 95%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 1rem;
`;

export const FormGroup = styled.div`
  position: relative;
  display: flex;
  min-width: 100%;
`;

export const SrOnly = styled.label`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
`;

export const Input = styled.input`
  width: 100%;
  height: 80px;
  padding: 0.75rem;
  border: 2px solid black;
  border-radius: 24px;
  font-size: 0.875rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }

  &::placeholder {
    font-size: 40px;
    color: #bdbdbd;
    font-family: Roboto;
    line-height: 42px;
    vertical-align: middle;
  }
`;

export const LoginButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #357abd;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.4);
  }
`;

export const BlueLine = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 96px;
  background-color: #006acd;
`;

export const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  img {
    z-index: 1;
  }
`;

export const LogoText = styled.p`
  font-family: "Wendy One", sans-serif;
  font-size: 40px;
  color: #fff;
  line-height: 42px;
`;
