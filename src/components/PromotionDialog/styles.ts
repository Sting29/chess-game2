import styled from "styled-components";

export const PromotionDialogContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border: 2px solid #333;
  border-radius: 8px;
  padding: 20px;
  z-index: 1000;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
`;

export const PromotionTitle = styled.h3`
  margin: 0 0 15px 0;
  text-align: center;
`;

export const PromotionButtonsContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
`;

interface PromotionButtonProps {
  $isHovered: boolean;
}

export const PromotionButton = styled.button<PromotionButtonProps>`
  padding: 10px;
  border: 1px solid ${(props) => (props.$isHovered ? "#999" : "#ccc")};
  border-radius: 4px;
  cursor: pointer;
  background-color: ${(props) => (props.$isHovered ? "#e9e9e9" : "#f9f9f9")};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  transition: all 0.2s ease;
  transform: ${(props) => (props.$isHovered ? "scale(1.05)" : "scale(1)")};

  &:hover {
    background-color: #e9e9e9;
    border-color: #999;
    transform: scale(1.05);
  }
`;

export const PieceContainer = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

export const FallbackPieceSymbol = styled.span`
  font-size: 24px;
  pointer-events: none;
`;
