import styled from "styled-components";
import question from "../../assets/images/question.png";

export const QuestionButtonWrap = styled.button`
  display: block;
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 8px;
  border: none;
  background: url(${question}) no-repeat center center;
  background-size: contain;
  transition: transform 0.2s;
  text-decoration: none;

  &:hover {
    transform: scale(1.05);
  }
`;
