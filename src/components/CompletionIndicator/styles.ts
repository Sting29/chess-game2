import styled from "styled-components";

export const CompletionIndicatorWrapper = styled.div<{ size: number }>`
  position: absolute;
  top: 25px;
  right: 53px;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  background-color: #22c55e; /* Green-500 */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const CheckIcon = styled.div`
  width: 60%;
  height: 60%;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    left: 20%;
    top: 20%;
    width: 25%;
    height: 50%;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }
`;
