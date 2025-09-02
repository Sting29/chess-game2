import React from "react";
import { CompletionIndicatorWrapper, CheckIcon } from "./styles";

interface CompletionIndicatorProps {
  isCompleted: boolean;
  size?: number;
}

const CompletionIndicator: React.FC<CompletionIndicatorProps> = ({
  isCompleted,
  size = 20,
}) => {
  if (!isCompleted) {
    return null;
  }

  return (
    <CompletionIndicatorWrapper size={size} aria-label="Completed">
      <CheckIcon />
    </CompletionIndicatorWrapper>
  );
};

export default CompletionIndicator;
