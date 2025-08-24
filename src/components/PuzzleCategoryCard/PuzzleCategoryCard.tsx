import React from "react";
import { useTranslation } from "react-i18next";
import { PuzzleCategory } from "../../types/types";
import Image from "../Image/Image";
import {
  PuzzleBoardButton,
  PuzzleCategory as PuzzleCategoryStyled,
  PuzzleCategoryTitle,
  PuzzleCategoryDescriptionWrap,
  PuzzleCategoryDescription,
  PuzzleCount,
  PuzzleCountText,
} from "./styles";

interface PuzzleCategoryCardProps {
  category: PuzzleCategory;
  onClick: (id: string) => void;
}

const PuzzleCategoryCard: React.FC<PuzzleCategoryCardProps> = ({
  category,
  onClick,
}) => {
  const { t } = useTranslation();

  return (
    <PuzzleBoardButton key={category.id} onClick={() => onClick(category.id)}>
      <PuzzleCategoryStyled>
        <PuzzleCategoryTitle>{t(category.titleKey)}</PuzzleCategoryTitle>
        <PuzzleCategoryDescriptionWrap>
          <PuzzleCategoryDescription>
            {t(category.descriptionKey)}
          </PuzzleCategoryDescription>
          <PuzzleCount>
            <PuzzleCountText>
              {t("tasks")}: {category.puzzles.length}
            </PuzzleCountText>
          </PuzzleCount>
        </PuzzleCategoryDescriptionWrap>
      </PuzzleCategoryStyled>
      <Image src={category.image} alt="" width={100} height={100} />
    </PuzzleBoardButton>
  );
};

export default PuzzleCategoryCard;
