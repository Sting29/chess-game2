import styled from "styled-components";
import chessboardBackground from "../../assets/background/login_background.jpg";
import loginFormBackground from "../../assets/background/login_form2.jpg";

export const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
      rgba(245, 245, 245, 0.3),
      rgba(245, 245, 245, 0.3)
    ),
    url(${chessboardBackground});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

export const LoginBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 502px;
  max-width: 502px;
  height: 502px;
  padding: 2rem;
  background-image: url(${loginFormBackground});
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

export const LoginHeader = styled.div`
  text-align: center;
  margin-bottom: 0.5rem;

  p {
    margin-top: 140px;
    font-size: 1.2rem;
    color: #666;
  }
`;

export const LoginForm = styled.form`
  min-width: 220px;
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
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
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
