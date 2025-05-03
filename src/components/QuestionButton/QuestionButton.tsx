import React from "react";
import { QuestionButtonWrap } from "./styles";

interface QuestionButtonProps {
  onClick: () => void;
}

const QuestionButton: React.FC<QuestionButtonProps> = ({ onClick }) => (
  <QuestionButtonWrap onClick={onClick}>?</QuestionButtonWrap>
);

export default QuestionButton;
