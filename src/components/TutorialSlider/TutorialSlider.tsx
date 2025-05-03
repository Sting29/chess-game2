import React, { useState } from "react";
import {
  SliderWrapper,
  ArrowButtonLeft,
  ArrowButtonRight,
  SlidesContainer,
} from "./styles";

interface TutorialSliderProps {
  children: React.ReactNode[];
  visibleCount: number;
}

const TutorialSlider: React.FC<TutorialSliderProps> = ({
  children,
  visibleCount,
}) => {
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
        aria-label="Previous"
      />
      <SlidesContainer>
        {children.slice(startIndex, startIndex + visibleCount)}
      </SlidesContainer>
      <ArrowButtonRight
        onClick={handleNext}
        disabled={isLastSlice}
        aria-label="Next"
      />
    </SliderWrapper>
  );
};

export default TutorialSlider;
