import styled from "styled-components";

export const AvatarContainer = styled.div<{ width: number; height: number }>`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  overflow: hidden;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }

  /* Responsive sizing */
  @media (max-width: 768px) {
    width: ${(props) => Math.max(60, props.width * 0.75)}px;
    height: ${(props) => Math.max(60, props.height * 0.75)}px;
    border-width: 2px;
  }

  @media (max-width: 480px) {
    width: ${(props) => Math.max(50, props.width * 0.625)}px;
    height: ${(props) => Math.max(50, props.height * 0.625)}px;
    border-width: 2px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  }
`;

export const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;
