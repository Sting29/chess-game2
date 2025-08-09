import styled, { css } from "styled-components";
import buttonSlide from "src/assets/elements/button_slide.png";
import { Direction } from "./TutorialSlider";

export const SliderWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const arrowButtonBase = css`
  width: 48px;
  height: 48px;
  background: url(${buttonSlide}) center/contain no-repeat;
  border: none;
  transition: transform 0.2s;
  padding: 0;
  background-color: transparent;
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
  }

  &:disabled {
    opacity: 0.4;
    cursor: default;
  }
`;

export const ArrowButtonLeft = styled.button`
  ${arrowButtonBase}
  transform: rotate(180deg);
  width: 120px;
  height: 120px;

  &:hover {
    transform: rotate(180deg);
  }
`;

export const ArrowButtonRight = styled.button`
  ${arrowButtonBase}
  width: 120px;
  height: 120px;
`;

interface SlidesContainerProps {
  direction: Direction;
}

export const SlidesContainer = styled.div<SlidesContainerProps>`
  display: flex;
  gap: 1rem;
  flex: 1;
  justify-content: center;
  flex-direction: ${(props: SlidesContainerProps) =>
    props.direction === "vertical" ? "column" : "row"};
  min-height: ${(props: SlidesContainerProps) =>
    props.direction === "vertical" ? "540px" : "auto"};
  overflow-y: ${(props: SlidesContainerProps) =>
    props.direction === "vertical" ? "auto" : "hidden"};
`;
