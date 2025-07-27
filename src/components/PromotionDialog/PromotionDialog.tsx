import { useState } from "react";
import { useCustomPieces } from "../CustomPieces/CustomPieces";
import { PromotionPiece } from "../../types/types";
import { useTranslation } from "react-i18next";
import {
  PromotionDialogContainer,
  PromotionTitle,
  PromotionButtonsContainer,
  PromotionButton,
  PieceContainer,
  FallbackPieceSymbol,
} from "./styles";

interface PromotionDialogProps {
  isOpen: boolean;
  onSelect: (piece: PromotionPiece) => void;
  onClose: () => void;
}

export function PromotionDialog({
  isOpen,
  onSelect,
  onClose,
}: PromotionDialogProps) {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const customPieces = useCustomPieces();
  const { t } = useTranslation();

  if (!isOpen) return null;

  // Function to render piece in promotion dialog
  function renderPromotionPiece(pieceType: PromotionPiece) {
    const pieceKey = `w${pieceType.toUpperCase()}` as keyof typeof customPieces;
    const PieceComponent = customPieces[pieceKey];

    if (PieceComponent) {
      return (
        <PieceContainer>
          {PieceComponent({
            fill: "#ffffff",
            svgStyle: { width: "100%", height: "100%" },
          })}
        </PieceContainer>
      );
    }

    // Fallback to Unicode symbols
    const symbols = { q: "♕", r: "♖", b: "♗", n: "♘" };
    return <FallbackPieceSymbol>{symbols[pieceType]}</FallbackPieceSymbol>;
  }

  const handleSelect = (piece: PromotionPiece) => {
    onSelect(piece);
    onClose();
  };

  return (
    <PromotionDialogContainer>
      <PromotionTitle>
        {t("choose_promotion_piece") || "Choose promotion piece"}:
      </PromotionTitle>
      <PromotionButtonsContainer>
        <PromotionButton
          onClick={() => handleSelect("q")}
          $isHovered={hoveredButton === "q"}
          onMouseEnter={() => setHoveredButton("q")}
          onMouseLeave={() => setHoveredButton(null)}
        >
          {renderPromotionPiece("q")}
        </PromotionButton>
        <PromotionButton
          onClick={() => handleSelect("r")}
          $isHovered={hoveredButton === "r"}
          onMouseEnter={() => setHoveredButton("r")}
          onMouseLeave={() => setHoveredButton(null)}
        >
          {renderPromotionPiece("r")}
        </PromotionButton>
        <PromotionButton
          onClick={() => handleSelect("b")}
          $isHovered={hoveredButton === "b"}
          onMouseEnter={() => setHoveredButton("b")}
          onMouseLeave={() => setHoveredButton(null)}
        >
          {renderPromotionPiece("b")}
        </PromotionButton>
        <PromotionButton
          onClick={() => handleSelect("n")}
          $isHovered={hoveredButton === "n"}
          onMouseEnter={() => setHoveredButton("n")}
          onMouseLeave={() => setHoveredButton(null)}
        >
          {renderPromotionPiece("n")}
        </PromotionButton>
      </PromotionButtonsContainer>
    </PromotionDialogContainer>
  );
}
