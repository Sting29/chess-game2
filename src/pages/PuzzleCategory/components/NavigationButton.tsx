import React from "react";
import styled from "styled-components";
import buttonSlide from "src/assets/elements/button_slide.png";

interface NavigationButtonProps {
  direction: "forward" | "backward";
  disabled: boolean;
  onClick: () => void;
}

const ButtonContainer = styled.button<{
  direction: "forward" | "backward";
  disabled: boolean;
}>`
  background: none;
  border: none;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  padding: 0;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, opacity 0.2s ease;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};

  &:hover:not(:disabled) {
    transform: scale(1.1);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:disabled {
    pointer-events: none;
  }

  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
  }

  @media (max-width: 480px) {
    width: 50px;
    height: 50px;
  }
`;

const ButtonImage = styled.img<{ direction: "forward" | "backward" }>`
  width: 100%;
  height: 100%;
  transform: ${(props) =>
    props.direction === "backward" ? "scaleX(-1)" : "none"};
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
`;

const NavigationButton: React.FC<NavigationButtonProps> = ({
  direction,
  disabled,
  onClick,
}) => {
  const handleClick = () => {
    if (!disabled) {
      onClick();
    }
  };

  return (
    <ButtonContainer
      direction={direction}
      disabled={disabled}
      onClick={handleClick}
      aria-label={`Go to ${direction === "forward" ? "next" : "previous"} page`}
    >
      <ButtonImage
        src={buttonSlide}
        alt={`${direction === "forward" ? "Next" : "Previous"} page`}
        direction={direction}
      />
    </ButtonContainer>
  );
};

export default NavigationButton;
