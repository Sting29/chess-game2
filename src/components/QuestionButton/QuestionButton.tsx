import React from "react";
import { QuestionButtonWrap } from "./styles";
import { useTranslation } from "react-i18next";

interface QuestionButtonProps {
  onClick: () => void;
}

const QuestionButton: React.FC<QuestionButtonProps> = ({ onClick }) => {
  const { t } = useTranslation();
  return (
    <QuestionButtonWrap onClick={onClick} aria-label={t("question_button")} />
  );
};

export default QuestionButton;
