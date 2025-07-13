import styled, { css } from "styled-components";
import buttonSlide from "src/assets/elements/button_slide.png";

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

export const SlidesContainer = styled.div`
  display: flex;
  gap: 1rem;
  flex: 1;
  justify-content: center;
`;
