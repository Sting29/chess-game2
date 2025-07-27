import styled from "styled-components";
import backgroundCheckLesson from "../../assets/background/background_account.png";

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: calc(100vh - 96px);
  padding: 0 40px;
  background-image: url(${backgroundCheckLesson});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
`;

export const Title = styled.h1`
  font-family: "RubikOne", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 48px;
  line-height: 50px;
  color: #3e302a;
  margin: 60px 0 40px;
  text-align: center;
`;
