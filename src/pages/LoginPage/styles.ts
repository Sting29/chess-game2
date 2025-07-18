import styled from "styled-components";
import chessboardBackground from "../../assets/background/background_login_test.png";
import buttonPlay from "../../assets/elements/button_play.png";

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
  margin: 60px auto 0;
`;

export const LoginHeader = styled.div`
  margin: 2rem 0;
`;

export const LoginForm = styled.form`
  width: 398px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 2rem;
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
  padding: 0.75rem 20px;
  border: 2px solid black;
  border-radius: 24px;
  font-size: 40px;
  font-family: Roboto;
  transition: border-color 0.2s;
  line-height: normal;

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
    line-height: normal;
  }

  /* Force override autofill styles */
  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    font-size: 40px !important;
    font-family: Roboto, sans-serif !important;
    -webkit-text-fill-color: #000 !important;
    transition: font-size 5000s ease-in-out 0s !important;
    -webkit-box-shadow: 0 0 0px 1000px white inset !important;
  }

  &:-moz-autofill {
    font-size: 40px !important;
    font-family: Roboto, sans-serif !important;
  }

  &:-webkit-autofill::first-line {
    font-size: 40px !important;
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

export const PlayButton = styled.button`
  width: 398px;
  height: 82px;
  border: none;
  background: url(${buttonPlay}) no-repeat center center;
  background-size: contain;
  transition: transform 0.2s;
  z-index: 1;

  &:hover {
    transform: scale(1.05);
  }
`;

export const CatContainer = styled.div<{ $isMobile: boolean }>`
  position: absolute;
  bottom: 10%;
  left: 20%;
  display: ${(props) => (props.$isMobile ? "none" : "block")};
`;

export const BoyContainer = styled.div<{ $isMobile: boolean }>`
  position: absolute;
  bottom: 15%;
  right: 17%;
  display: ${(props) => (props.$isMobile ? "none" : "block")};
`;

export const ErrorMessage = styled.div`
  background-color: #fee;
  border: 1px solid #fcc;
  color: #c33;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  text-align: center;
  width: 100%;
  margin-bottom: 1rem;
`;

export const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #006acd;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 20px auto;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

// export const Title = styled.p`
//   font-family: "WendyOne", sans-serif;
//   font-size: 44px;
//   color: #fff7db;
//   line-height: 46px;
//   font-weight: 700;
// `;
