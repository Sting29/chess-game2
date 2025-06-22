import React, { useState } from "react";
import {
  SliderWrapper,
  ArrowButtonLeft,
  ArrowButtonRight,
  SlidesContainer,
} from "./styles";
import { useTranslation } from "react-i18next";

interface TutorialSliderProps {
  children: React.ReactNode[];
  visibleCount: number;
}

const TutorialSlider: React.FC<TutorialSliderProps> = ({
  children,
  visibleCount,
}) => {
  const { t } = useTranslation();
  const [startIndex, setStartIndex] = useState(0);

  // Последний возможный стартовый индекс, чтобы не выйти за пределы массива
  const lastSliceStart =
    children.length <= visibleCount
      ? 0
      : children.length - (children.length % visibleCount || visibleCount);

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(0, prev - visibleCount));
  };

  const handleNext = () => {
    const nextIndex = startIndex + visibleCount;
    if (nextIndex >= children.length) {
      setStartIndex(lastSliceStart);
    } else {
      setStartIndex(nextIndex);
    }
  };

  // Определяем, показываем ли последний слайс
  const isLastSlice = startIndex >= lastSliceStart;

  return (
    <SliderWrapper>
      <ArrowButtonLeft
        onClick={handlePrev}
        disabled={startIndex === 0}
        aria-label={t("previous")}
      />
      <SlidesContainer>
        {children.slice(startIndex, startIndex + visibleCount)}
      </SlidesContainer>
      <ArrowButtonRight
        onClick={handleNext}
        disabled={isLastSlice}
        aria-label={t("next")}
      />
    </SliderWrapper>
  );
};

export default TutorialSlider;
